export default {
  HOST_NAME: 'api.paypay.ne.jp',
  BASE_PATH: '/v2',
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
  API_ACCOUNT_LINK: {
    QRCODE_CREATE: {
      METHOD: 'POST',
      PATH: 'qr/sessions',
    }
  }
};
