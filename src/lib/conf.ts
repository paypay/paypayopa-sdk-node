/* Copyright 2020, Robosoft */
'use strict';

import CONSTANTS from './constants';

interface Config {
  HOST_NAME: string;
  BASE_PATH: string;
  PORT_NUMBER?: number;
  API_PAYMENT: {};
  API_WALLET: {};
  API_DIRECT_DEBIT: {};
  API_APP_INVOKE: {};
  API_WEB_CASHIER: {};
}

class Conf {
  options: any;
  private readonly configLookup: any;
  private readonly config: Config = {
    HOST_NAME: 'stg.paypay-corp.co.jp',
    BASE_PATH: '/opa/api/v1/',
    API_PAYMENT: {
      QRCODE_CREATE: {
        METHOD: 'POST',
        PATH: 'codes',
      },
      QRCODE_DELETE: {
        METHOD: 'DELETE',
        PATH: 'codes/{codeId}',
      },
      GET_PAYMENT_DETAILS: {
        METHOD: 'GET',
        PATH: 'payments/{merchantPaymentId}',
      },
      CANCEL_PAYMENT: {
        METHOD: 'DELETE',
        PATH: 'payments/{merchantPaymentId}',
      },
      PAYMENT_AUTH_CAPTURE: {
        METHOD: 'POST',
        PATH: 'payments/capture',
      },
      PAYMENT_AUTH_REVERT: {
        METHOD: 'POST',
        PATH: 'payments/preauthorize/revert',
      },
      REFUND_PAYMENT: {
        METHOD: 'POST',
        PATH: 'refunds',
      },
      GET_REFUND_DETAILS: {
        METHOD: 'GET',
        PATH: 'refunds/{merchantRefundId}',
      },
    },
    API_WALLET: {
      CHECK_BALANCE: {
        METHOD: 'GET',
        PATH: 'wallet/check_balance?userAuthorizationId={userAuthorizationId}&amount={amount}&currency={currency}',
      },
    },
    API_DIRECT_DEBIT: {
      AUTHORIZATION: {
        METHOD: 'GET',
        PATH: 'user_authorization?apiKey={apiKey}&requestToken={jwtToken}',
      },
      AUTHORIZATION_RESULT: {
        METHOD: 'GET',
        PATH: 'user_authorization?apiKey={apiKey}&responseToken={jwtToken}',
      },
    },
    API_APP_INVOKE: {},
    API_WEB_CASHIER: {},
  };

  constructor() {
    this.configLookup = JSON.parse(JSON.stringify(this.config));
  }

  setHttpsOptions(options: any) {
    this.options = options;
  }

  getHttpsOptions() {
    return this.options === '' ? false : this.options;
  }

  getHttpsMethod(nameApi: any, nameMethod: any): any {
    return this.configLookup[nameApi][nameMethod].METHOD;
  }

  getHttpsPath(nameApi: string | number, nameMethod: string | number) {
    return this.configLookup.BASE_PATH + this.configLookup[nameApi][nameMethod].PATH;
  }

  getHostname() {
    return CONSTANTS.HOST_NAME;
  }

  getPortNumber() {
    return this.config.PORT_NUMBER ? this.config.PORT_NUMBER : 443;
  }
}

export let config = new Conf();
