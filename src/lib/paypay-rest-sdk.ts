/*
 * Main file, methods that are exposed to end-user
 */
import { Auth } from "./auth";
import { Conf } from "./conf";
import { HttpsClient, HttpsClientError, HttpsClientMessage, HttpsClientSuccess } from "./httpsClient";
import { HmacSHA256, enc, algo } from "crypto-js";
import { v4 as uuidv4 } from "uuid";
import * as jwt from "jsonwebtoken";

interface Endpoint {
  method: string,
  path: string,
  apiKey: string | undefined,
}

class PayPayRestSDK {
  private productionMode: boolean = false;
  private perfMode: boolean = false;
  private readonly auth: Auth;
  private config: Conf;
  private httpsClient: HttpsClient = new HttpsClient();

  constructor() {
    this.config = new Conf(this.productionMode, this.perfMode);
    this.auth = new Auth();
  }

  /**
   * Replace the HttpsClient that this SDK client instance uses for API calls.
   */
  setHttpsClient(httpsClient: HttpsClient) {
    this.httpsClient = httpsClient;
  }

  /**
   * Set authentication passed by end-user
   * @param clientConfig
   */
  public configure = (clientConfig: { clientId: string; clientSecret: string; merchantId?: string; productionMode?: boolean; perfMode?: boolean; }) => {
    this.auth.setAuth(clientConfig.clientId, clientConfig.clientSecret, clientConfig.merchantId);
    if (clientConfig.productionMode) {
      this.productionMode = clientConfig.productionMode
    } else {
      this.productionMode = false;
    }
    if (clientConfig.perfMode) {
      this.perfMode = clientConfig.perfMode
    }
    this.config = new Conf(this.productionMode, this.perfMode);
  }

  private createAuthHeader = (method: string, resourceUrl: string, body: unknown) => {
    const epoch = Math.floor(Date.now() / 1000);
    const nonce = uuidv4();

    const jsonified = JSON.stringify(body);
    const isempty = [undefined, null, "", "undefined", "null"];

    let contentType;
    let payloadDigest;
    if (isempty.includes(jsonified)) {
      contentType = "empty";
      payloadDigest = "empty";
    } else {
      contentType = "application/json";
      payloadDigest = algo.MD5.create()
        .update(contentType)
        .update(jsonified)
        .finalize()
        .toString(enc.Base64);
    }
    const signatureRawList = [resourceUrl, method, nonce, epoch, contentType, payloadDigest];
    const signatureRawData = signatureRawList.join("\n");
    const hashed = HmacSHA256(signatureRawData, this.auth.clientSecret);
    const hashed64 = enc.Base64.stringify(hashed);
    const headList = [this.auth.clientId, hashed64, nonce, epoch, payloadDigest];
    const header = headList.join(":");
    return `hmac OPA-Auth:${header}`;
  }

  private fillPathTemplate(template: string, input: any[]) {
    const queryParams = template.match(/{\w+}/g);
    if (queryParams) {
      queryParams.forEach((q, n) => {
        template = template.replace(q, input[n]);
      });
    }
    return template;
  }

  private paypaySetupOptions = (endpoint: Endpoint, input: any) => {
    const method = endpoint.method;
    const path = (method === "GET" || method === "DELETE")
      ? this.fillPathTemplate(endpoint.path, input)
      : endpoint.path;

    const headers: Record<string, string | number> = {};

    const isempty = ["undefined", "null"];
    if (this.auth.merchantId && !isempty.includes(this.auth.merchantId)) {
      headers["X-ASSUME-MERCHANT"] = this.auth.merchantId;
    }

    if (method === "POST") {
      input.requestedAt = Math.round(new Date().getTime() / 1000);
      headers["Content-Type"] = "application/json";
      headers["Content-Length"] = Buffer.byteLength(JSON.stringify(input));
    }

    const cleanPath = path.split("?")[0];
    const authHeader = this.createAuthHeader(method,
      cleanPath,
      method === "GET" || method === "DELETE" ? null : input);
    headers["Authorization"] = authHeader;

    return {
      apiKey: endpoint.apiKey,
      hostname: this.config.getHostname(),
      port: this.config.getPortNumber(),
      headers,
      path,
      method,
    };
  }

  private getEndpoint = (nameApi: string, nameMethod: string, pathSuffix = ""): Endpoint => {
    return {
      method: this.config.getHttpsMethod(nameApi, nameMethod),
      path: this.config.getHttpsPath(nameApi, nameMethod) + pathSuffix,
      apiKey: this.config.getApiKey(nameApi, nameMethod),
    };
  }

  private invokeMethod = (
    endpoint: Endpoint,
    payload: unknown,
    callback?: HttpsClientMessage): Promise<HttpsClientSuccess | HttpsClientError> => {
    const options = this.paypaySetupOptions(endpoint, payload);
    return new Promise((resolve) => {
      this.httpsClient.httpsCall(options, payload, (result) => {
        resolve(result);
        if (callback !== undefined) {
          callback(result);
        }
      });
    });
  }

  /**
   * Create a dynamic QR Code to receive payments
   * @callback                Callback function to handle result
   * @returns {Promise}       Promise resolving to object containing STATUS and BODY
   * @param {Object} payload  JSON object payload
   * @param {boolean} [agreeSimilarTransaction] (Optional) If set to "true", the payment duplication check will be bypassed.
   * @param {Callback} [callback] (Optional) The callback to invoke when a response is received.
   */
  public createPayment = (
    payload: any,
    ...args: [callback?: HttpsClientMessage] | [agreeSimilarTransaction: boolean, callback?: HttpsClientMessage]
  ) => {
    const agreeSimilarTransaction = args[0] === true;
    const callback = typeof args[0] === "boolean" ? args[1] : args[0];
    const endpoint = this.getEndpoint("API_PAYMENT", "CREATE_PAYMENT", `?agreeSimilarTransaction=${agreeSimilarTransaction}`);
    return this.invokeMethod(endpoint, payload, callback);
  }

  /**
   * Create a dynamic QR Code to receive payments
   * @callback                Callback function to handle result
   * @returns {Promise}       Promise resolving to object containing STATUS and BODY
   * @param {Object} payload  JSON object payload
   */
  public qrCodeCreate = (payload: any, callback?: HttpsClientMessage) => {
    return this.invokeMethod(this.getEndpoint("API_PAYMENT", "QRCODE_CREATE"), payload, callback);
  }

  /**
   * Delete a created dynamic QR Code
   * @callback                    Callback function to handle result
   * @returns {Object}            Returns result containing STATUS and BODY
   * @param {string} inputParams  Array of codeId : QR Code that is to be deleted
   */
  public qrCodeDelete = (inputParams: Array<string | number>, callback?: HttpsClientMessage) => {
    return this.invokeMethod(this.getEndpoint("API_PAYMENT", "QRCODE_DELETE"), inputParams, callback);
  }

  /**
   * Get payment details for web cashier and Dynamic QR
   *
   * @callback                    Callback function to handle result
   * @returns {Promise}           Promise resolving to object containing STATUS and BODY
   * @param {string} inputParams  Array of merchantPaymentId : The unique payment transaction id provided by merchant
   */
  public getCodePaymentDetails = (inputParams: Array<string | number>, callback?: HttpsClientMessage) => {
    return this.invokeMethod(this.getEndpoint("API_PAYMENT", "GET_CODE_PAYMENT_DETAILS"), inputParams, callback);
  }

  /**
   * Get payment details
   *
   * @callback                    Callback function to handle result
   * @returns {Promise}           Promise resolving to object containing STATUS and BODY
   * @param {string} inputParams  Array of merchantPaymentId : The unique payment transaction id provided by merchant
   */
  public getPaymentDetails = (inputParams: Array<string | number>, callback?: HttpsClientMessage) => {
    return this.invokeMethod(this.getEndpoint("API_PAYMENT", "GET_PAYMENT_DETAILS"), inputParams, callback);
  }

  /**
   * Cancel a payment
   * This api is used in case, while creating a payment, the client can not determine the status of the payment
   *
   * @callback                    Callback function to handle result
   * @returns {Promise}           Promise resolving to object containing STATUS and BODY
   * @param {string} inputParams  Array of merchantPaymentId : The unique payment transaction id provided by merchant
   */
  public paymentCancel = (inputParams: Array<string | number>, callback?: HttpsClientMessage) => {
    return this.invokeMethod(this.getEndpoint("API_PAYMENT", "CANCEL_PAYMENT"), inputParams, callback);
  }

  /**
   * Capture a payment authorization
   * This api is used to capture the payment authorization for a payment
   *
   * @callback                Callback function to handle result
   * @returns {Promise}       Promise resolving to object containing STATUS and BODY
   * @param {Object} payload  JSON object payload
   */
  public paymentAuthCapture = (payload: any, callback?: HttpsClientMessage) => {
    return this.invokeMethod(this.getEndpoint("API_PAYMENT", "PAYMENT_AUTH_CAPTURE"), payload, callback);
  }

  /**
   * Revert a payment authorization
   * The following api is used when a payment needs to be cancelled. For example, when the user cancels the order
   *
   * @callback                Callback function to handle result
   * @returns {Promise}       Promise resolving to object containing STATUS and BODY
   * @param {Object} payload  JSON object payload
   */
  public paymentAuthRevert = (payload: any, callback?: HttpsClientMessage) => {
    return this.invokeMethod(this.getEndpoint("API_PAYMENT", "PAYMENT_AUTH_REVERT"), payload, callback);
  }

  /**
   * Refund a payment
   *
   * @callback                Callback function to handle result
   * @returns {Promise}       Promise resolving to object containing STATUS and BODY
   * @param {Object} payload  JSON object payload
   */
  public paymentRefund = (payload: any, callback?: HttpsClientMessage) => {
    return this.invokeMethod(this.getEndpoint("API_PAYMENT", "REFUND_PAYMENT"), payload, callback);
  }

  /**
   * Get refund details
   *
   * @callback                    Callback function to handle result
   * @returns {Promise}           Promise resolving to object containing STATUS and BODY
   * @param {string} inputParams  Array of merchantPaymentId : The unique payment transaction id provided by merchant
   */
  public getRefundDetails = (inputParams: Array<string | number>, callback?: HttpsClientMessage) => {
    return this.invokeMethod(this.getEndpoint("API_PAYMENT", "GET_REFUND_DETAILS"), inputParams, callback);
  }

  /**
   * Check user wallet balance
   * Check if user has enough balance to make a payment
   *
   * @callback                   Callback function to handle result
   * @returns {Promise}          Promise resolving to object containing STATUS and BODY
   * @param {Array} inputParams  Array of userAuthorizationId, amount, currency, productType
   */
  public checkUserWalletBalance = (inputParams: Array<string | number>, callback?: HttpsClientMessage) => {
    return this.invokeMethod(this.getEndpoint("API_WALLET", "CHECK_BALANCE"), inputParams, callback);
  }

  /**
   * Direct user to the authorization web page
   *
   * @callback                   Callback function to handle result
   * @returns {Object}           Returns result containing STATUS and BODY
   * @param {Array} inputParams  Array of apiKey, jwtToken
   */
  public authorization = (inputParams: Array<string | number>, callback?: HttpsClientMessage) => {
    return this.invokeMethod(this.getEndpoint("API_DIRECT_DEBIT", "AUTHORIZATION"), inputParams, callback);
  }

  /**
   * Receive the user authorization result
   *
   * @callback                   Callback function to handle result
   * @returns {Promise}          Promise resolving to object containing STATUS and BODY
   * @param {Array} inputParams  Array of apiKey, jwtToken
   */
  public authorizationResult = (inputParams: Array<string | number>, callback?: HttpsClientMessage) => {
    return this.invokeMethod(this.getEndpoint("API_DIRECT_DEBIT", "AUTHORIZATION_RESULT"), inputParams, callback);
  }

  /**
   * Create an account link QR Code to authorise OPA client
   * @callback                Callback function to handle result
   * @returns {Promise}       Promise resolving to object containing STATUS and BODY
   * @param {Object} payload  JSON object payload
   */
  public accountLinkQRCodeCreate = (payload: any, callback?: HttpsClientMessage) => {
    return this.invokeMethod(this.getEndpoint("API_ACCOUNT_LINK", "QRCODE_CREATE"), payload, callback);
  }

  /**
   * Verify the validity of a JWT token
   * @returns {Object}               Returns the decoded token
   * @param {Object} token           The token to be verified
   * @param {Object} clientSecret    The client secret to be used for verification
   */
  public validateJWT = (token: string, clientSecret: string): string | object => {
    return jwt.verify(token, Buffer.from(clientSecret, "base64"));
  }

  public paymentPreauthorize = (
    payload: any,
    ...args: [callback?: HttpsClientMessage] | [agreeSimilarTransaction: boolean, callback?: HttpsClientMessage]
  ) => {
    const agreeSimilarTransaction = args[0] === true;
    const callback = typeof args[0] === "boolean" ? args[1] : args[0];
    const endpoint = this.getEndpoint("API_PAYMENT", "PREAUTHORIZE", `?agreeSimilarTransaction=${agreeSimilarTransaction}`);
    return this.invokeMethod(endpoint, payload, callback);
  }

  public paymentSubscription = (payload: any, callback?: HttpsClientMessage) => {
    return this.invokeMethod(this.getEndpoint("API_SUBSCRIPTION", "PAYMENTS"), payload, callback);
  }

  /**
   * Create pending payment
   *
   * @callback                Callback function to handle result
   * @returns {Promise}       Promise resolving to object containing STATUS and BODY
   * @param {Object} payload  JSON object payload
   */
  public createPendingPayment = (payload: any, callback?: HttpsClientMessage) => {
    return this.invokeMethod(this.getEndpoint("API_REQUEST_ORDER", "PENDING_PAYMENT_CREATE"), payload, callback);
  }

  /**
   * Get pending order details
   *
   * @callback                    Callback function to handle result
   * @returns {Promise}           Promise resolving to object containing STATUS and BODY
   * @param {string} inputParams  Array of merchantPaymentId : The unique payment transaction id provided by merchant
   */
  public getPendingPaymentDetails = (inputParams: Array<string | number>, callback?: HttpsClientMessage) => {
    return this.invokeMethod(this.getEndpoint("API_REQUEST_ORDER", "GET_ORDER_DETAILS"), inputParams, callback);
  }

  /**
   * Cancel pending order
   *
   * @callback                    Callback function to handle result
   * @returns {Promise}           Promise resolving to object containing STATUS and BODY
   * @param {string} inputParams  Array of merchantPaymentId : The unique payment transaction id provided by merchant
   */
  public cancelPendingOrder = (inputParams: Array<string | number>, callback?: HttpsClientMessage) => {
    return this.invokeMethod(this.getEndpoint("API_REQUEST_ORDER", "PENDING_ORDER_CANCEL"), inputParams, callback);
  }

  /**
   * Refund pending payment
   *
   * @callback                Callback function to handle result
   * @returns {Promise}       Promise resolving to object containing STATUS and BODY
   * @param {Object} payload  JSON object payload
   */
  public refundPendingPayment = (payload: any, callback?: HttpsClientMessage) => {
    return this.invokeMethod(this.getEndpoint("API_PAYMENT", "REFUND_PAYMENT"), payload, callback);
  }

  /**
   * Get user authorization status
   *
   * @callback                    Callback function to handle result
   * @returns {Promise}           Promise resolving to object containing STATUS and BODY
   * @param {string} inputParams  Array of UserAuthorizationId : The unique UserAuthorizationId id 
   */
  public getUserAuthorizationStatus = (inputParams: Array<string | number>, callback?: HttpsClientMessage) => {
    return this.invokeMethod(this.getEndpoint("USER_AUTHORIZATION", "GET_USER_AUTHORIZATION_STATUS"), inputParams, callback);
  }

  /**
   * Unlink user
   *
   * @callback                    Callback function to handle result
   * @returns {Promise}           Promise resolving to object containing STATUS and BODY
   * @param {string} inputParams  Array of UserAuthorizationId : The unique UserAuthorizationId id 
   */
  public unlinkUser = (inputParams: Array<string | number>, callback?: HttpsClientMessage) => {
    return this.invokeMethod(this.getEndpoint("USER_AUTHORIZATION", "UNLINK_USER"), inputParams, callback);
  }

  /**
    * Cash back
    * 
    * @callback                    Callback function to handle result
    * @returns {Object}            Returns result containing STATUS and BODY
    * @param {string} inputParams  Array of UserAuthorizationId : The unique UserAuthorizationId id 
    * @param inputParams 
    * @param callback 
    */
  public cashBack = (payload: any, callback?: HttpsClientMessage) => {
    return this.invokeMethod(this.getEndpoint("API_PAYMENT", "GIVE_CASH_BACK"), payload, callback);
  }

  /**
   * Get Cash back details
   * 
   * @callback                    Callback function to handle result
   * @returns {Promise}           Promise resolving to object containing STATUS and BODY
   * @param {string} inputParams  Array of UserAuthorizationId : The unique UserAuthorizationId id 
   * @param inputParams 
   * @param callback 
   */
  public getCashBackDetails = (inputParams: Array<string | number>, callback?: HttpsClientMessage) => {
    return this.invokeMethod(this.getEndpoint("API_PAYMENT", "CHECK_CASHBACK_DETAILS"), inputParams, callback);
  }

  /**
   * Reverse Cash back
   * 
   * @callback                    Callback function to handle result
   * @returns {Promise}           Promise resolving to object containing STATUS and BODY
   * @param {string} inputParams  Array of UserAuthorizationId : The unique UserAuthorizationId id 
   * @param inputParams 
   * @param callback 
   */
  public reverseCashBack = (payload: any, callback?: HttpsClientMessage) => {
    return this.invokeMethod(this.getEndpoint("API_PAYMENT", "REVERSAL_CASHBACK"), payload, callback);
  }

  /**
   * Get Reverse Cash back details
   * 
   * @callback                    Callback function to handle result
   * @returns {Promise}           Promise resolving to object containing STATUS and BODY
   * @param {string} inputParams  Array of UserAuthorizationId : The unique UserAuthorizationId id 
   * @param inputParams 
   * @param callback 
   */
  public getReverseCashBackDetails = (inputParams: Array<string | number>, callback?: HttpsClientMessage) => {
    return this.invokeMethod(this.getEndpoint("API_PAYMENT", "CHECK_CASHBACK_REVERSE_DETAILS"), inputParams, callback);
  }
}

/**
 * These are methods and variables that are exposed to end-user
 */
export let payPayRestSDK = new PayPayRestSDK();
export { PayPayRestSDK };
