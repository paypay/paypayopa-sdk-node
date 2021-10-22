/*
 * Main file, methods that are exposed to end-user
 */
import { Auth } from "./auth";
import { Conf } from "./conf";
import { httpsClient, HttpsClientMessage } from "./httpsClient";
import { HmacSHA256, enc, algo } from "crypto-js";
import { v4 as uuidv4 } from "uuid";
import * as jwt from "jsonwebtoken";

class PayPayRestSDK {
  private productionMode: boolean = false;
  private perfMode: boolean = false;
  private readonly auth: Auth;
  private config: Conf;

  constructor() {
    this.config = new Conf(this.productionMode, this.perfMode);
    this.auth = new Auth();
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

    let contentType = "application/json";
    let payload = JSON.stringify(body);
    const isempty = ["", "undefined", "null"];

    if (isempty.includes(payload)) {
      contentType = "empty";
      payload = "empty";
    } else {
      let md5 = algo.MD5.create();
      md5.update(contentType);
      md5.update(payload);
      payload = md5
        .finalize()
        .toString(enc.Base64)
        .toString();
    }
    const signatureRawList = [resourceUrl, method, nonce, epoch, contentType, payload];
    const signatureRawData = signatureRawList.join("\n");
    const hashed = HmacSHA256(signatureRawData, this.auth.clientSecret);
    const hashed64 = enc.Base64.stringify(hashed);
    const headList = [this.auth.clientId, hashed64, nonce, epoch, payload];
    const header = headList.join(":");
    return `hmac OPA-Auth:${header}`;
  }

  private paypaySetupOptions = (nameApi: string, nameMethod: string, input: any) => {
    let path = this.config.getHttpsPath(nameApi, nameMethod);
    const method = this.config.getHttpsMethod(nameApi, nameMethod);

    if (method === "GET" || method === "DELETE") {
      const queryParams = path.match(/{\w+}/g);
      if (queryParams) {
        queryParams.forEach((q: any, n: string | number) => {
          path = path.replace(q, input[n]);
        });
      }
    }

    const cleanPath = path.split("?")[0];
    const authHeader = this.createAuthHeader(method,
      cleanPath,
      method === "GET" || method === "DELETE" ? null : input);

    const headers: Record<string, string | number> = {};
    headers["Authorization"] = authHeader;

    const isempty = ["undefined", "null"];
    if (this.auth.merchantId && !isempty.includes(this.auth.merchantId)) {
      headers["X-ASSUME-MERCHANT"] = this.auth.merchantId;
    }

    if (method === "POST") {
      input.requestedAt = Math.round(new Date().getTime() / 1000);
      headers["Content-Type"] = "application/json";
      headers["Content-Length"] = Buffer.byteLength(JSON.stringify(input));
    }

    return {
      apiKey: this.config.getApiKey(nameApi, nameMethod),
      hostname: this.config.getHostname(),
      port: this.config.getPortNumber(),
      headers,
      path,
      method,
    };
  }

  private invokeMethod(nameApi: string, nameMethod: string, payload: unknown, callback: HttpsClientMessage) {
    const options = this.paypaySetupOptions(nameApi, nameMethod, payload);
    httpsClient.httpsCall(options, payload, (result) => callback(result));
  }

  /**
   * Create a dynamic QR Code to receive payments
   * @callback                Callback function to handle result
   * @returns {Object}        Returns result containing STATUS and BODY
   * @param {Object} payload  JSON object payload
   */
  public createPayment = (payload: any, callback: HttpsClientMessage) => {
    this.invokeMethod("API_PAYMENT", "CREATE_PAYMENT", payload, callback);
  }

  /**
   * Create a dynamic QR Code to receive payments
   * @callback                Callback function to handle result
   * @returns {Object}        Returns result containing STATUS and BODY
   * @param {Object} payload  JSON object payload
   */
  public qrCodeCreate = (payload: any, callback: HttpsClientMessage) => {
    this.invokeMethod("API_PAYMENT", "QRCODE_CREATE", payload, callback);
  }

  /**
   * Delete a created dynamic QR Code
   * @callback                    Callback function to handle result
   * @returns {Object}            Returns result containing STATUS and BODY
   * @param {string} inputParams  Array of codeId : QR Code that is to be deleted
   */
  public qrCodeDelete = (inputParams: Array<string | number>, callback: HttpsClientMessage) => {
    this.invokeMethod("API_PAYMENT", "QRCODE_DELETE", inputParams, callback);
  }

  /**
   * Get payment details for web cashier and Dynamic QR
   *
   * @callback                    Callback function to handle result
   * @returns {Object}            Returns result containing STATUS and BODY
   * @param {string} inputParams  Array of merchantPaymentId : The unique payment transaction id provided by merchant
   */
  public getCodePaymentDetails = (inputParams: Array<string | number>, callback: HttpsClientMessage) => {
    this.invokeMethod("API_PAYMENT", "GET_CODE_PAYMENT_DETAILS", inputParams, callback);
  }

  /**
   * Get payment details
   *
   * @callback                    Callback function to handle result
   * @returns {Object}            Returns result containing STATUS and BODY
   * @param {string} inputParams  Array of merchantPaymentId : The unique payment transaction id provided by merchant
   */
  public getPaymentDetails = (inputParams: Array<string | number>, callback: HttpsClientMessage) => {
    this.invokeMethod("API_PAYMENT", "GET_PAYMENT_DETAILS", inputParams, callback);
  }

  /**
   * Cancel a payment
   * This api is used in case, while creating a payment, the client can not determine the status of the payment
   *
   * @callback                    Callback function to handle result
   * @returns {Object}            Returns result containing STATUS and BODY
   * @param {string} inputParams  Array of merchantPaymentId : The unique payment transaction id provided by merchant
   */
  public paymentCancel = (inputParams: Array<string | number>, callback: HttpsClientMessage) => {
    this.invokeMethod("API_PAYMENT", "CANCEL_PAYMENT", inputParams, callback);
  }

  /**
   * Capture a payment authorization
   * This api is used to capture the payment authorization for a payment
   *
   * @callback                Callback function to handle result
   * @returns {Object}        Returns result containing STATUS and BODY
   * @param {Object} payload  JSON object payload
   */
  public paymentAuthCapture = (payload: any, callback: HttpsClientMessage) => {
    this.invokeMethod("API_PAYMENT", "PAYMENT_AUTH_CAPTURE", payload, callback);
  }

  /**
   * Revert a payment authorization
   * The following api is used when a payment needs to be cancelled. For example, when the user cancels the order
   *
   * @callback                Callback function to handle result
   * @returns {Object}        Returns result containing STATUS and BODY
   * @param {Object} payload  JSON object payload
   */
  public paymentAuthRevert = (payload: any, callback: HttpsClientMessage) => {
    this.invokeMethod("API_PAYMENT", "PAYMENT_AUTH_REVERT", payload, callback);
  }

  /**
   * Refund a payment
   *
   * @callback                Callback function to handle result
   * @returns {Object}        Returns result containing STATUS and BODY
   * @param {Object} payload  JSON object payload
   */
  public paymentRefund = (payload: any, callback: HttpsClientMessage) => {
    this.invokeMethod("API_PAYMENT", "REFUND_PAYMENT", payload, callback);
  }

  /**
   * Get refund details
   *
   * @callback                    Callback function to handle result
   * @returns {Object}            Returns result containing STATUS and BODY
   * @param {string} inputParams  Array of merchantPaymentId : The unique payment transaction id provided by merchant
   */
  public getRefundDetails = (inputParams: Array<string | number>, callback: HttpsClientMessage) => {
    this.invokeMethod("API_PAYMENT", "GET_REFUND_DETAILS", inputParams, callback);
  }

  /**
   * Check user wallet balance
   * Check if user has enough balance to make a payment
   *
   * @callback                   Callback function to handle result
   * @returns {Object}           Returns result containing STATUS and BODY
   * @param {Array} inputParams  Array of userAuthorizationId, amount, currency, productType
   */
  public checkUserWalletBalance = (inputParams: Array<string | number>, callback: HttpsClientMessage) => {
    this.invokeMethod("API_WALLET", "CHECK_BALANCE", inputParams, callback);
  }

  /**
   * Direct user to the authorization web page
   *
   * @callback                   Callback function to handle result
   * @returns {Object}           Returns result containing STATUS and BODY
   * @param {Array} inputParams  Array of apiKey, jwtToken
   */
  public authorization = (inputParams: Array<string | number>, callback: HttpsClientMessage) => {
    this.invokeMethod("API_DIRECT_DEBIT", "AUTHORIZATION", inputParams, callback);
  }

  /**
   * Receive the user authorization result
   *
   * @callback                   Callback function to handle result
   * @returns {Object}           Returns result containing STATUS and BODY
   * @param {Array} inputParams  Array of apiKey, jwtToken
   */
  public authorizationResult = (inputParams: Array<string | number>, callback: HttpsClientMessage) => {
    this.invokeMethod("API_DIRECT_DEBIT", "AUTHORIZATION_RESULT", inputParams, callback);
  }

  /**
   * Create an account link QR Code to authorise OPA client
   * @callback                Callback function to handle result
   * @returns {Object}        Returns result containing STATUS and BODY
   * @param {Object} payload  JSON object payload
   */
  public accountLinkQRCodeCreate = (payload: any, callback: HttpsClientMessage): void => {
    this.invokeMethod("API_ACCOUNT_LINK", "QRCODE_CREATE", payload, callback);
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

  public paymentPreauthorize = (payload: any, callback: HttpsClientMessage): void => {
    this.invokeMethod("API_PAYMENT", "PREAUTHORIZE", payload, callback);
  }

  public paymentSubscription = (payload: any, callback: HttpsClientMessage): void => {
    this.invokeMethod("API_SUBSCRIPTION", "PAYMENTS", payload, callback);
  }

  /**
   * Create pending payment
   *
   * @callback                Callback function to handle result
   * @returns {Object}        Returns result containing STATUS and BODY
   * @param {Object} payload  JSON object payload
   */
  public createPendingPayment = (payload: any, callback: HttpsClientMessage): void => {
    this.invokeMethod("API_REQUEST_ORDER", "PENDING_PAYMENT_CREATE", payload, callback);
  }

  /**
   * Get pending order details
   *
   * @callback                    Callback function to handle result
   * @returns {Object}            Returns result containing STATUS and BODY
   * @param {string} inputParams  Array of merchantPaymentId : The unique payment transaction id provided by merchant
   */
  public getPendingPaymentDetails = (inputParams: Array<string | number>, callback: HttpsClientMessage): void => {
    this.invokeMethod("API_REQUEST_ORDER", "GET_ORDER_DETAILS", inputParams, callback);
  }

  /**
   * Cancel pending order
   *
   * @callback                    Callback function to handle result
   * @returns {Object}            Returns result containing STATUS and BODY
   * @param {string} inputParams  Array of merchantPaymentId : The unique payment transaction id provided by merchant
   */
  public cancelPendingOrder = (inputParams: Array<string | number>, callback: HttpsClientMessage): void => {
    this.invokeMethod("API_REQUEST_ORDER", "PENDING_ORDER_CANCEL", inputParams, callback);
  }

  /**
   * Refund pending payment
   *
   * @callback                Callback function to handle result
   * @returns {Object}        Returns result containing STATUS and BODY
   * @param {Object} payload  JSON object payload
   */
  public refundPendingPayment = (payload: any, callback: HttpsClientMessage): void => {
    this.invokeMethod("API_PAYMENT", "REFUND_PAYMENT", payload, callback);
  }

  /**
   * Get user authorization status
   *
   * @callback                    Callback function to handle result
   * @returns {Object}            Returns result containing STATUS and BODY
   * @param {string} inputParams  Array of UserAuthorizationId : The unique UserAuthorizationId id 
   */
  public getUserAuthorizationStatus = (inputParams: Array<string | number>, callback: HttpsClientMessage): void => {
    this.invokeMethod("USER_AUTHORIZATION", "GET_USER_AUTHORIZATION_STATUS", inputParams, callback);
  }

  /**
   * Unlink user
   *
   * @callback                    Callback function to handle result
   * @returns {Object}            Returns result containing STATUS and BODY
   * @param {string} inputParams  Array of UserAuthorizationId : The unique UserAuthorizationId id 
   */
  public unlinkUser = (inputParams: Array<string | number>, callback: HttpsClientMessage): void => {
    this.invokeMethod("USER_AUTHORIZATION", "UNLINK_USER", inputParams, callback);
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
  public cashBack = (payload: any, callback: HttpsClientMessage): void => {
    this.invokeMethod("API_PAYMENT", "GIVE_CASH_BACK", payload, callback);
  }

  /**
   * Get Cash back details
   * 
   * @callback                    Callback function to handle result
   * @returns {Object}            Returns result containing STATUS and BODY
   * @param {string} inputParams  Array of UserAuthorizationId : The unique UserAuthorizationId id 
   * @param inputParams 
   * @param callback 
   */
  public getCashBackDetails = (inputParams: Array<string | number>, callback: HttpsClientMessage): void => {
    this.invokeMethod("API_PAYMENT", "CHECK_CASHBACK_DETAILS", inputParams, callback);
  }

  /**
   * Reverse Cash back
   * 
   * @callback                    Callback function to handle result
   * @returns {Object}            Returns result containing STATUS and BODY
   * @param {string} inputParams  Array of UserAuthorizationId : The unique UserAuthorizationId id 
   * @param inputParams 
   * @param callback 
   */
  public reverseCashBack = (payload: any, callback: HttpsClientMessage): void => {
    this.invokeMethod("API_PAYMENT", "REVERSAL_CASHBACK", payload, callback);
  }

  /**
   * Get Reverse Cash back details
   * 
   * @callback                    Callback function to handle result
   * @returns {Object}            Returns result containing STATUS and BODY
   * @param {string} inputParams  Array of UserAuthorizationId : The unique UserAuthorizationId id 
   * @param inputParams 
   * @param callback 
   */
  public getReverseCashBackDetails = (inputParams: Array<string | number>, callback: HttpsClientMessage): void => {
    this.invokeMethod("API_PAYMENT", "CHECK_CASHBACK_REVERSE_DETAILS", inputParams, callback);
  }

}

/**
 * These are methods and variables that are exposed to end-user
 */
export let payPayRestSDK = new PayPayRestSDK();
export { PayPayRestSDK };
