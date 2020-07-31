/* Copyright 2020, Robosoft */
'use strict';

/*
 * Main file, methods that are exposed to end-user
 */
import { auth } from './auth';
import { config } from './conf';
import { httpsClient } from './httpsClient';
import CryptoJS from 'crypto-js';
import { v4 as uuidv4 } from 'uuid';

interface HttpsClientMessage {
  (message: string): void;
}

class PayPayRestSDK {
  private static options: any = '';

  constructor() {}

  /**
   * Set authentication passed by end-user
   * @param {string} clientId     API_KEY provided by end-user
   * @param {string} clientSecret API_SECRET provided by end-user
   */
  public configure(clientConfig: { clientId: string; clientSecret: string }) {
    auth.setAuth(clientConfig.clientId, clientConfig.clientSecret);
  }

  private static createAuthHeader = (method: string, resourceUrl: string, payLoad: any, auth: any) => {
    let AUTH_TYPE = "hmac OPA-Auth";
    const epoch = Date.now();
    let contentType = 'application/json';
    const nonce	= uuidv4();
    let bodyHash = "";
    if (method == "GET" || !payLoad) {
      payLoad = "";
      bodyHash = "empty";
      contentType = "empty";
      console.log(`coming inside GET`);
    } else {
      let md5 = CryptoJS.algo.MD5.create();
      md5.update(contentType);
      md5.update(payLoad);
      bodyHash = md5
        .finalize()
        .toString(CryptoJS.enc.Base64)
        .toString("utf-8");
    }
    let pathfinder = resourceUrl.split("?");
    resourceUrl = pathfinder[0];
    let signatureRawData = [resourceUrl, method, nonce, epoch, contentType, bodyHash].join("\n");
    let hash = CryptoJS.HmacSHA256(signatureRawData, auth[1]);
    let hashInBase64 = encodeURI(CryptoJS.enc.Base64.stringify(hash));
    let header = [auth[0], hashInBase64, nonce, epoch, bodyHash].join(":");
    return AUTH_TYPE + ":" + header;
  }

  private static setHttpsOptions(header: string) {
    PayPayRestSDK.options = {
      hostname: config.getHostname(),
      port: config.getPortNumber(),
      path: '',
      method: '',
      headers: {
        Authorization: header,
      },
    };
    config.setHttpsOptions(this.options);
  }

  private static paypaySetupOptions(nameApi: string, nameMethod: string, input: any) {
    let queryParams = [];
    PayPayRestSDK.options = config.getHttpsOptions();
    this.options.path = config.getHttpsPath(nameApi, nameMethod);
    this.options.method = config.getHttpsMethod(nameApi, nameMethod);
    const authHeader = this.createAuthHeader(this.options.method,
                                               this.options.path,
                                               input,
                                               auth)
    if (false === config.getHttpsOptions() || undefined === config.getHttpsOptions()) {
      this.setHttpsOptions(authHeader);
    }
    if (this.options.method === 'POST') {
      this.options.headers['Content-Type'] = 'application/json';
      this.options.headers['Content-Length'] = Buffer.byteLength(JSON.stringify(input));
    } else {
      queryParams = this.options.path.match(/{\w+}/g);
      queryParams.forEach((q: any, n: string | number) => {
        this.options.path = this.options.path.replace(q, input[n]);
      });
    }
    return this.options;
  }

  /**
   * Create a dynamic QR Code to receive payments
   * @callback                Callback function to handle result
   * @returns {Object}        Returns result containing STATUS and BODY
   * @param {Object} payload  JSON object payload
   */
  public qrCodeCreate(payload: any, callback: HttpsClientMessage): void {
    httpsClient.httpsCall(PayPayRestSDK.paypaySetupOptions('API_PAYMENT', 'QRCODE_CREATE', payload), payload, (result: any) => {
      callback(result);
    });
  }

  /**
   * Delete a created dynamic QR Code
   * @callback                    Callback function to handle result
   * @returns {Object}            Returns result containing STATUS and BODY
   * @param {string} inputParams  Array of codeId : QR Code that is to be deleted
   */
  public qrCodeDelete(inputParams: Array<string | number>, callback: HttpsClientMessage): void {
    httpsClient.httpsCall(PayPayRestSDK.paypaySetupOptions('API_PAYMENT', 'QRCODE_DELETE', inputParams), '', (result: any) => {
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
  public getPaymentDetails(inputParams: Array<string | number>, callback: HttpsClientMessage): void {
    httpsClient.httpsCall(PayPayRestSDK.paypaySetupOptions('API_PAYMENT', 'GET_PAYMENT_DETAILS', inputParams), '', (result: any) => {
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
  public paymentCancel(inputParams: Array<string | number>, callback: HttpsClientMessage): void {
    httpsClient.httpsCall(PayPayRestSDK.paypaySetupOptions('API_PAYMENT', 'CANCEL_PAYMENT', inputParams), '', (result: any) => {
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
  public paymentAuthCapture(payload: Array<string | number>, callback: HttpsClientMessage): void {
    httpsClient.httpsCall(PayPayRestSDK.paypaySetupOptions('API_PAYMENT', 'PAYMENT_AUTH_CAPTURE', payload), payload.toString(), (result: any) => {
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
  public paymentAuthRevert(payload: Array<string | number>, callback: HttpsClientMessage): void {
    httpsClient.httpsCall(PayPayRestSDK.paypaySetupOptions('API_PAYMENT', 'PAYMENT_AUTH_REVERT', payload), payload.toString(), (result: any) => {
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
  public paymentRefund(payload: Array<string | number>, callback: HttpsClientMessage): void {
    httpsClient.httpsCall(PayPayRestSDK.paypaySetupOptions('API_PAYMENT', 'REFUND_PAYMENT', payload), payload.toString(), (result: any) => {
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
  public getRefundDetails(inputParams: Array<string | number>, callback: HttpsClientMessage): void {
    httpsClient.httpsCall(PayPayRestSDK.paypaySetupOptions('API_PAYMENT', 'GET_REFUND_DETAILS', inputParams), '', (result: any) => {
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
  public checkUserWalletBalance(inputParams: Array<string | number>, callback: HttpsClientMessage): void {
    httpsClient.httpsCall(PayPayRestSDK.paypaySetupOptions('API_WALLET', 'CHECK_BALANCE', inputParams), '', (result: any) => {
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
  public authorization(inputParams: Array<string | number>, callback: HttpsClientMessage): void {
    httpsClient.httpsCall(PayPayRestSDK.paypaySetupOptions('API_DIRECT_DEBIT', 'AUTHORIZATION', inputParams), '', (result: any) => {
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
  public authorizationResult(inputParams: Array<string | number>, callback: HttpsClientMessage): void {
    httpsClient.httpsCall(PayPayRestSDK.paypaySetupOptions('API_DIRECT_DEBIT', 'AUTHORIZATION_RESULT', inputParams), '', (result: any) => {
      callback(result);
    });
  }
}

/**
 * These are methods and variables that are exposed to end-user
 */
export let payPayRestSDK = new PayPayRestSDK();
