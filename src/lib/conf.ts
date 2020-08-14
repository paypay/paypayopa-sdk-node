'use strict';

export interface Config {
  HOST_NAME: string;
  BASE_PATH: string;
  PORT_NUMBER?: number;
  API_PAYMENT: {};
  API_WALLET: {};
  API_DIRECT_DEBIT: {};
  API_APP_INVOKE: {};
  API_WEB_CASHIER: {};
  API_ACCOUNT_LINK: {};
}

export class Conf {
  options: { [k: string]: any } = {};
  private readonly configLookup: any;
  private readonly config: Config = {
    HOST_NAME: 'stg-api.sandbox.paypay.ne.jp',
    BASE_PATH: '/v2/',
    API_PAYMENT: {
      QRCODE_CREATE: {
        METHOD: 'POST',
        PATH: '/v2/codes',
      },
      QRCODE_DELETE: {
        METHOD: 'DELETE',
        PATH: '/v2/codes/{codeId}',
      },
      GET_CODE_PAYMENT_DETAILS: {
        METHOD: 'GET',
        PATH: '/v2/codes/payments/{merchantPaymentId}',
      },
      GET_PAYMENT_DETAILS: {
        METHOD: 'GET',
        PATH: '/v2/payments/{merchantPaymentId}',
      },      
      CANCEL_PAYMENT: {
        METHOD: 'DELETE',
        PATH: '/v2/payments/{merchantPaymentId}',
      },
      PAYMENT_AUTH_CAPTURE: {
        METHOD: 'POST',
        PATH: '/v2/payments/capture',
      },
      PAYMENT_AUTH_REVERT: {
        METHOD: 'POST',
        PATH: '/v2/payments/preauthorize/revert',
      },
      REFUND_PAYMENT: {
        METHOD: 'POST',
        PATH: '/v2/refunds',
      },
      GET_REFUND_DETAILS: {
        METHOD: 'GET',
        PATH: '/v2/refunds/{merchantRefundId}',
      },
    },
    API_WALLET: {
      CHECK_BALANCE: {
        METHOD: 'GET',
        PATH: '/v2/wallet/check_balance?userAuthorizationId={userAuthorizationId}&amount={amount}&currency={currency}',
      },
    },
    API_DIRECT_DEBIT: {
      AUTHORIZATION: {
        METHOD: 'GET',
        PATH: '/v2/user_authorization?apiKey={apiKey}&requestToken={jwtToken}',
      },
      AUTHORIZATION_RESULT: {
        METHOD: 'GET',
        PATH: '/v2/user_authorization?apiKey={apiKey}&responseToken={jwtToken}',
      },
    },
    API_APP_INVOKE: {},
    API_WEB_CASHIER: {},
    API_ACCOUNT_LINK: {
      QRCODE_CREATE: {
        METHOD: 'POST',
        PATH: '/v1/qr/sessions',
      }
    }
  };

  private readonly prodConfig:Config = {
    HOST_NAME: 'api.paypay.ne.jp',
    BASE_PATH: '/v2/',
    API_PAYMENT: {
      QRCODE_CREATE: {
        METHOD: 'POST',
        PATH: '/v2/codes',
      },
      QRCODE_DELETE: {
        METHOD: 'DELETE',
        PATH: '/v2/codes/{codeId}',
      },
      GET_CODE_PAYMENT_DETAILS: {
        METHOD: 'GET',
        PATH: '/v2/codes/payments/{merchantPaymentId}',
      },
      GET_PAYMENT_DETAILS: {
        METHOD: 'GET',
        PATH: '/v2/payments/{merchantPaymentId}',
      },
      CANCEL_PAYMENT: {
        METHOD: 'DELETE',
        PATH: '/v2/payments/{merchantPaymentId}',
      },
      PAYMENT_AUTH_CAPTURE: {
        METHOD: 'POST',
        PATH: '/v2/payments/capture',
      },
      PAYMENT_AUTH_REVERT: {
        METHOD: 'POST',
        PATH: '/v2/payments/preauthorize/revert',
      },
      REFUND_PAYMENT: {
        METHOD: 'POST',
        PATH: '/v2/refunds',
      },
      GET_REFUND_DETAILS: {
        METHOD: 'GET',
        PATH: '/v2/refunds/{merchantRefundId}',
      },
    },
    API_WALLET: {
      CHECK_BALANCE: {
        METHOD: 'GET',
        PATH: '/v2/wallet/check_balance?userAuthorizationId={userAuthorizationId}&amount={amount}&currency={currency}',
      },
    },
    API_DIRECT_DEBIT: {
      AUTHORIZATION: {
        METHOD: 'GET',
        PATH: '/v2/user_authorization?apiKey={apiKey}&requestToken={jwtToken}',
      },
      AUTHORIZATION_RESULT: {
        METHOD: 'GET',
        PATH: '/v2/user_authorization?apiKey={apiKey}&responseToken={jwtToken}',
      },
    },
    API_APP_INVOKE: {},
    API_WEB_CASHIER: {},
    API_ACCOUNT_LINK: {
      QRCODE_CREATE: {
        METHOD: 'POST',
        PATH: '/v1/qr/sessions',
      }
    }
  };

  constructor(productionMode: boolean = false) {
    if (productionMode) {
      this.configLookup = JSON.parse(JSON.stringify(this.prodConfig));
    } else {
      this.configLookup = JSON.parse(JSON.stringify(this.config));
    }
  }

  setHttpsOptions(options: any) {
    this.options = options;
  }

  getHttpsOptions() {
    return this.options;
  }

  getHttpsMethod(nameApi: any, nameMethod: any): any {
    return this.configLookup[nameApi][nameMethod].METHOD;
  }

  getHttpsPath(nameApi: string | number, nameMethod: string | number) {
    return this.configLookup[nameApi][nameMethod].PATH;
  }

  getHostname() {
    return this.configLookup.HOST_NAME;
  }

  getPortNumber() {
    return this.config.PORT_NUMBER ? this.config.PORT_NUMBER : 443;
  }
}

// export let config = new Conf();
