import { payPayRestSDK } from '../src/lib/paypay-rest-sdk';

payPayRestSDK.configure({
  clientId: "a_1obUPwUWdx_2uR6",
  clientSecret: "L24NeSrLDnpxEKq6z4y1QTuhl1/j4RdYZsLeN6cZ",
});

describe('Generating PAYPAY TEST CASE', (): any => {
    test('HMAC createAuthHeader Methods', (): any => {
        const body = {
            "merchantPaymentId":"Test123",
            "amount":{"amount":20, "currency":"JPY"},
            "codeType":"ORDER_QR",
            "orderItems":[{"name":"Cake","quantity":1,"unitPrice":{"amount":20,"currency":"JPY"}}]
        };  
        const auth = {
            clientId: "a_1obUPwUWdx_2uR6",
            clientSecret: "L24NeSrLDnpxEKq6z4y1QTuhl1/j4RdYZsLeN6cZ"
        };
        const exampleProto = Object.getPrototypeOf(payPayRestSDK);
        const token = exampleProto.constructor.createAuthHeader("POST", "/v2/codes", body, auth);
        const tokenSplit = token ? token.split(":") : [];
        expect(tokenSplit).toHaveLength(6);
    });
})



