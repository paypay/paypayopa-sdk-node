/* Copyright 2020, Robosoft */
'use strict';

import { payPayRestSDK } from './lib/paypay-rest-sdk';

export = {
  Configure: payPayRestSDK.configure,
  QRCodeCreate: payPayRestSDK.qrCodeCreate,
  QRCodeDelete: payPayRestSDK.qrCodeDelete,
  GetPaymentDetails: payPayRestSDK.getPaymentDetails,
  PaymentCancel: payPayRestSDK.paymentCancel,
  PaymentAuthCapture: payPayRestSDK.paymentAuthCapture,
  PaymentAuthRevert: payPayRestSDK.paymentAuthRevert,
  PaymentRefund: payPayRestSDK.paymentRefund,
  GetRefundDetails: payPayRestSDK.getRefundDetails,
  CheckUserWalletBalance: payPayRestSDK.checkUserWalletBalance,
  Authorization: payPayRestSDK.authorization,
  AuthorizationResult: payPayRestSDK.authorizationResult,
};
