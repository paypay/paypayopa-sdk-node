# Paypay OPA SDK
[![License](https://img.shields.io/:license-apache2.0-red.svg)](https://opensource.org/licenses/Apache-2.0)
[![codecov](https://codecov.io/gh/paypay/paypayopa-sdk-node/branch/master/graph/badge.svg)](https://codecov.io/gh/paypay/paypayopa-sdk-node)

So you are a developer and want to start accepting payments using PayPay. PayPay's Payment SDK is the simplest way to achieve the integration. With PayPay's Payment SDK, you can build a custom Payment checkout process to suit your unique business needs and branding guidelines.

# When to use QR Code Payments
QR Code flow is recommended normally in the following scenarios
- Payment to happen on a Tablet
- Payments on Vending Machines
- Payment to happen on a TV Screen
- Printing a QR Code for Bill Payment

## Understanding the Payment Flow
Following diagram defines the flow for Dynamic QR Code.
![](https://www.paypay.ne.jp/opa/doc/v1.0/imgs/dynamicqrcode-sequence.png)

We recommend that the merchant implements a Polling of the Get payment Details API with a 4-5 second interval in order to know the status of the transaction.

## Lets get Started
Once you have understood the payment flow, before we start the integration make sure you have:

- [Registered](https://developer.paypay.ne.jp/) for a PayPay developer/merchant Account
- Get the API key and secret from the Developer Panel.
- Use the sandbox API Keys to test out the integration

### Install npm package
```sh
$ npm install paypayopa
```
