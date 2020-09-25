/*
 * Main file, methods that are exposed to end-user
 */
import { auth } from './auth';
import { Conf } from './conf';
import { httpsClient } from './httpsClient';
import CryptoJS from 'crypto-js';
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';

export interface HttpsClientMessage {
  (message: string): void;
}

class PayPayRestSDK {
  private options: any = '';
  private productionMode: boolean = false;
  private config: Conf;

  constructor() {
    this.config = new Conf(this.productionMode);
  }

  /**
   * Set authentication passed by end-user
   * @param {string}  clientId      API_KEY provided by end-user
   * @param {string}  clientSecret  API_SECRET provided by end-user
   * @param {string}  merchantId    MERCHANT_ID provided by end-user
   */
  public configure = (clientConfig: { clientId: string; clientSecret: string; merchantId: string; productionMode: boolean; }) => {
    auth.setAuth(clientConfig.clientId, clientConfig.clientSecret, clientConfig.merchantId);
    if (clientConfig.productionMode) {
      this.productionMode = clientConfig.productionMode
    } else {
      this.productionMode = false;
    }
    this.config = new Conf(this.productionMode);
  }

  private createAuthHeader = (method: string, resourceUrl: string, body: any, auth: any) => {
    const epoch = Math.floor(Date.now() / 1000);
    const nonce = uuidv4();

    let contentType = 'application/json';
    let payload = JSON.stringify(body);
    let isempty: any = [undefined, null, "", 'undefined', 'null'];

    if (isempty.includes(payload)) {
      contentType = 'empty';
      payload = 'empty';
    } else {
      let md5 = CryptoJS.algo.MD5.create();
      md5.update(contentType);
      md5.update(payload);
      payload = md5
        .finalize()
        .toString(CryptoJS.enc.Base64)
        .toString("utf-8");
    }
    const signatureRawList = [resourceUrl, method, nonce, epoch, contentType, payload];
    const signatureRawData = signatureRawList.join("\n");
    const hashed = CryptoJS.HmacSHA256(signatureRawData, auth.clientSecret);
    const hashed64 = CryptoJS.enc.Base64.stringify(hashed);
    const headList = [auth.clientId, hashed64, nonce, epoch, payload];
    const header = headList.join(":");
    return `hmac OPA-Auth:${header}`;
  }

  private setHttpsOptions(header: string) {
    let isempty: any = [undefined, null, "", 'undefined', 'null'];
    this.options.hostname = this.config.getHostname();
    this.options.port = this.config.getPortNumber();
    this.options.headers = {
      "Authorization": header,
      "X-ASSUME-MERCHANT": auth.merchantId,
    };
    if (isempty.includes(auth.merchantId)) {
      this.options.headers = {
        "Authorization": header,
      };
    }
    this.config.setHttpsOptions(this.options);
  }

  private paypaySetupOptions = (nameApi: string, nameMethod: string, input: any) => {

    let queryParams = [];
    this.options = this.config.getHttpsOptions();

    this.options.path = this.config.getHttpsPath(nameApi, nameMethod);
    this.options.method = this.config.getHttpsMethod(nameApi, nameMethod);

    if (this.options.method === 'GET') {
      queryParams = this.options.path.match(/{\w+}/g);
      if (queryParams) {
        queryParams.forEach((q: any, n: string | number) => {
          this.options.path = this.options.path.replace(q, input[n]);
        });
      }
    }

    const authHeader = this.createAuthHeader(this.options.method,
      this.options.path,
      this.options.method === 'GET' ? null : input,
      auth);
    this.setHttpsOptions(authHeader);

    if (this.options.method === 'POST') {
      this.options.headers['Content-Type'] = 'application/json';
      this.options.headers['Content-Length'] = Buffer.byteLength(JSON.stringify(input));
    }
    return this.options;
  }

  /**
   * Create a dynamic QR Code to receive payments
   * @callback                Callback function to handle result
   * @returns {Object}        Returns result containing STATUS and BODY
   * @param {Object} payload  JSON object payload
   */
  public qrCodeCreate = (payload: any, callback: HttpsClientMessage) => {
    httpsClient.httpsCall(this.paypaySetupOptions('API_PAYMENT', 'QRCODE_CREATE', payload), payload, (result: any) => {
      callback(result);
    });
  }

  /**
   * Delete a created dynamic QR Code
   * @callback                    Callback function to handle result
   * @returns {Object}            Returns result containing STATUS and BODY
   * @param {string} inputParams  Array of codeId : QR Code that is to be deleted
   */
  public qrCodeDelete = (inputParams: Array<string | number>, callback: HttpsClientMessage) => {
    httpsClient.httpsCall(this.paypaySetupOptions('API_PAYMENT', 'QRCODE_DELETE', inputParams), '', (result: any) => {
      callback(result);
    });
  }

  /**
   * Get payment details for web cashier and Dynamic QR
   *
   * @callback                    Callback function to handle result
   * @returns {Object}            Returns result containing STATUS and BODY
   * @param {string} inputParams  Array of merchantPaymentId : The unique payment transaction id provided by merchant
   */
  public getCodePaymentDetails = (inputParams: Array<string | number>, callback: HttpsClientMessage) => {
    httpsClient.httpsCall(this.paypaySetupOptions('API_PAYMENT', 'GET_CODE_PAYMENT_DETAILS', inputParams), '', (result: any) => {
      callback(result);
    });
  }

  /**
   * Get payment details
   *
   * @callback                    Callback function to handle result
   * @returns {Object}            Returns result containing STATUS and BODY
   * @param {string} inputParams  Array of merchantPaymentId : The unique payment transaction id provided by merchant
   */
  public getPaymentDetails = (inputParams: Array<string | number>, callback: HttpsClientMessage) => {
    httpsClient.httpsCall(this.paypaySetupOptions('API_PAYMENT', 'GET_PAYMENT_DETAILS', inputParams), '', (result: any) => {
      callback(result);
    });
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
    httpsClient.httpsCall(this.paypaySetupOptions('API_PAYMENT', 'CANCEL_PAYMENT', inputParams), '', (result: any) => {
      callback(result);
    });
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
    httpsClient.httpsCall(this.paypaySetupOptions('API_PAYMENT', 'PAYMENT_AUTH_CAPTURE', payload), payload, (result: any) => {
      callback(result);
    });
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
    httpsClient.httpsCall(this.paypaySetupOptions('API_PAYMENT', 'PAYMENT_AUTH_REVERT', payload), payload, (result: any) => {
      callback(result);
    });
  }

  /**
   * Refund a payment
   *
   * @callback                Callback function to handle result
   * @returns {Object}        Returns result containing STATUS and BODY
   * @param {Object} payload  JSON object payload
   */
  public paymentRefund = (payload: any, callback: HttpsClientMessage) => {
    httpsClient.httpsCall(this.paypaySetupOptions('API_PAYMENT', 'REFUND_PAYMENT', payload), payload, (result: any) => {
      callback(result);
    });
  }

  /**
   * Get refund details
   *
   * @callback                    Callback function to handle result
   * @returns {Object}            Returns result containing STATUS and BODY
   * @param {string} inputParams  Array of merchantPaymentId : The unique payment transaction id provided by merchant
   */
  public getRefundDetails = (inputParams: Array<string | number>, callback: HttpsClientMessage) => {
    httpsClient.httpsCall(this.paypaySetupOptions('API_PAYMENT', 'GET_REFUND_DETAILS', inputParams), '', (result: any) => {
      callback(result);
    });
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
    httpsClient.httpsCall(this.paypaySetupOptions('API_WALLET', 'CHECK_BALANCE', inputParams), '', (result: any) => {
      callback(result);
    });
  }

  /**
   * Direct user to the authorization web page
   *
   * @callback                   Callback function to handle result
   * @returns {Object}           Returns result containing STATUS and BODY
   * @param {Array} inputParams  Array of apiKey, jwtToken
   */
  public authorization = (inputParams: Array<string | number>, callback: HttpsClientMessage) => {
    httpsClient.httpsCall(this.paypaySetupOptions('API_DIRECT_DEBIT', 'AUTHORIZATION', inputParams), '', (result: any) => {
      callback(result);
    });
  }

  /**
   * Receive the user authorization result
   *
   * @callback                   Callback function to handle result
   * @returns {Object}           Returns result containing STATUS and BODY
   * @param {Array} inputParams  Array of apiKey, jwtToken
   */
  public authorizationResult = (inputParams: Array<string | number>, callback: HttpsClientMessage) => {
    httpsClient.httpsCall(this.paypaySetupOptions('API_DIRECT_DEBIT', 'AUTHORIZATION_RESULT', inputParams), '', (result: any) => {
      callback(result);
    });
  }

  /**
   * Create an account link QR Code to authorise OPA client
   * @callback                Callback function to handle result
   * @returns {Object}        Returns result containing STATUS and BODY
   * @param {Object} payload  JSON object payload
   */
  public accountLinkQRCodeCreate = (payload: any, callback: HttpsClientMessage): void => {
    httpsClient.httpsCall(this.paypaySetupOptions('API_ACCOUNT_LINK', 'QRCODE_CREATE', payload), payload, (result: any) => {
      callback(result);
    });
  }

  /**
   * Verify the validity of a JWT token
   * @returns {Object}               Returns the decoded token
   * @param {Object} token           The token to be verified
   * @param {Object} clientSecret    The client secret to be used for verification
   */
  public validateJWT = (token: string, clientSecret: string): string | object => {
    return jwt.verify(token, Buffer.from(clientSecret, 'base64'));
  }

  public paymentPreauthorize = (payload: any, callback: HttpsClientMessage): void => {
    httpsClient.httpsCall(this.paypaySetupOptions('API_PAYMENT', 'PREAUTHORIZE', payload), payload, (result: any) => {
      callback(result);
    })
  }

  public paymentSubscription = (payload: any, callback: HttpsClientMessage): void => {
    httpsClient.httpsCall(this.paypaySetupOptions('API_SUBSCRIPTION', 'PAYMENTS', payload), payload, (result: any) => {
      callback(result);
    })
  }

  /**
   * Create pending payment
   *
   * @callback                Callback function to handle result
   * @returns {Object}        Returns result containing STATUS and BODY
   * @param {Object} payload  JSON object payload
   */
  public createPendingPayment = (payload: any, callback: HttpsClientMessage): void => {
    httpsClient.httpsCall(this.paypaySetupOptions('API_REQUEST_ORDER', 'PENDING_PAYMENT_CREATE', payload), payload, (result: any) => {
      callback(result);
    })
  }

  /**
   * Get pending order details
   *
   * @callback                    Callback function to handle result
   * @returns {Object}            Returns result containing STATUS and BODY
   * @param {string} inputParams  Array of merchantPaymentId : The unique payment transaction id provided by merchant
   */
  public getPendingOrderDetails = (inputParams: Array<string | number>, callback: HttpsClientMessage): void => {
    httpsClient.httpsCall(this.paypaySetupOptions('API_REQUEST_ORDER', 'GET_ORDER_DETAILS', inputParams), '', (result: any) => {
      callback(result);
    })
  }

  /**
   * Cancel pending order
   *
   * @callback                    Callback function to handle result
   * @returns {Object}            Returns result containing STATUS and BODY
   * @param {string} inputParams  Array of merchantPaymentId : The unique payment transaction id provided by merchant
   */
  public cancelPendingOrder = (inputParams: Array<string | number>, callback: HttpsClientMessage): void => {
    httpsClient.httpsCall(this.paypaySetupOptions('API_REQUEST_ORDER', 'PENDING_ORDER_CANCEL', inputParams), '', (result: any) => {
      callback(result);
    })
  }

  /**
   * Refund pending payment
   *
   * @callback                Callback function to handle result
   * @returns {Object}        Returns result containing STATUS and BODY
   * @param {Object} payload  JSON object payload
   */
  public refundPendingPayment = (payload: any, callback: HttpsClientMessage): void => {
    httpsClient.httpsCall(this.paypaySetupOptions('API_REQUEST_ORDER', 'PAYMENT_REFUND', payload), payload, (result: any) => {
      callback(result);
    })
  }
}

/**
 * These are methods and variables that are exposed to end-user
 */
export let payPayRestSDK = new PayPayRestSDK();
