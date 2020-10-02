# Paypay OPA SDK - Node

[![License](https://img.shields.io/:license-apache2.0-red.svg)](https://opensource.org/licenses/Apache-2.0)
[![npm](https://img.shields.io/npm/v/@paypayopa/paypayopa-sdk-node)](https://www.npmjs.com/package/@paypayopa/paypayopa-sdk-node)
[![Build Status](https://travis-ci.org/paypay/paypayopa-sdk-node.svg?branch=master)](https://travis-ci.org/paypay/paypayopa-sdk-node)
[![Coverage Status](https://coveralls.io/repos/github/paypay/paypayopa-sdk-node/badge.svg?branch=master)](https://coveralls.io/github/paypay/paypayopa-sdk-node?branch=master)
[![Language grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/paypay/paypayopa-sdk-node.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/paypay/paypayopa-sdk-node/context:javascript)
[![Maintainability](https://api.codeclimate.com/v1/badges/e3cf7a7e9153531b0f48/maintainability)](https://codeclimate.com/github/paypay/paypayopa-sdk-node/maintainability)
[![Black Duck Security Risk](https://copilot.blackducksoftware.com/github/repos/paypay/paypayopa-sdk-node/branches/master/badge-risk.svg)](https://copilot.blackducksoftware.com/github/repos/paypay/paypayopa-sdk-node/branches/master)
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fpaypay%2Fpaypayopa-sdk-node.svg?type=shield)](https://app.fossa.com/projects/git%2Bgithub.com%2Fpaypay%2Fpaypayopa-sdk-node?ref=badge_shield)
![Snyk Vulnerabilities for GitHub Repo](https://img.shields.io/snyk/vulnerabilities/github/paypay/paypayopa-sdk-node)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=paypay_paypayopa-sdk-node&metric=alert_status)](https://sonarcloud.io/dashboard?id=paypay_paypayopa-sdk-node)
[![npm](https://img.shields.io/npm/dm/@paypayopa/paypayopa-sdk-node)](https://www.npmjs.com/package/@paypayopa/paypayopa-sdk-node)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/b17690606bb64c51a1c65c65a8a75b1f)](https://app.codacy.com/gh/paypay/paypayopa-sdk-node?utm_source=github.com&utm_medium=referral&utm_content=paypay/paypayopa-sdk-node&utm_campaign=Badge_Grade_Settings)
[![BCH compliance](https://bettercodehub.com/edge/badge/paypay/paypayopa-sdk-node?branch=master)](https://bettercodehub.com/)

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
$ npm i @paypayopa/paypayopa-sdk-node
```


## License
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fpaypay%2Fpaypayopa-sdk-node.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2Fpaypay%2Fpaypayopa-sdk-node?ref=badge_large)
