import { payPayRestSDK } from "../src/lib/paypay-rest-sdk";
import * as Prod from '../src/lib/conf.prod.json'


const conf = {
    clientId: '5345435fsdfsr54353454',
    clientSecret: 'dgfgdfgt46435gsdr35tte5',
    merchantId: '2473982',
    productionMode: false
};
payPayRestSDK.configure(conf);


test('Unit Test - URL Resolve', async () => {
    expect(Prod.API_PAYMENT.GET_CODE_PAYMENT_DETAILS.API_NAME).toBe('v2_getQRPaymentDetails');
});