import { payPayRestSDK } from '../src/lib/paypay-rest-sdk';

describe('Generating PAYPAY TEST CASE', (): any => {
    // Dummy Client Key Generator for testing purpose
    const keyGenerate = (keyLength: number) => {
        let result           = '';
        let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz_0123456789';
        let charactersLength = characters.length;
        for (let i = 0; i < keyLength; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
     }

    test('HMAC createAuthHeader Methods', (): any => {
        const body = {
            "merchantPaymentId":"Test123",
            "amount":{"amount":20, "currency":"JPY"},
            "codeType":"ORDER_QR",
            "orderItems":[{"name":"Cake","quantity":1,"unitPrice":{"amount":20,"currency":"JPY"}}]
        };  
        const auth = {
            clientId: keyGenerate(17),
            clientSecret: keyGenerate(40)
        };
        const exampleProto = Object.getPrototypeOf(payPayRestSDK);
        const token = exampleProto.constructor.createAuthHeader("POST", "/v2/codes", body, auth);
        console.log(token);
        const tokenSplit = token ? token.split(":") : [];
        expect(tokenSplit).toHaveLength(6);
    });
})



