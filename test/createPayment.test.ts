import { payPayRestSDK } from "../src/lib/paypay-rest-sdk";
import { httpsClient } from '../src/lib/httpsClient';
const { v4: uuidv4 } = require('uuid');

const conf = {
    clientId: '5345435fsdfsr54353454',
    clientSecret: 'dgfgdfgt46435gsdr35tte5',
    merchantId: '2473982',
    productionMode: false
};

payPayRestSDK.configure(conf);

test('Unit Test - Create Payment', async () => {

    const payload = {
        "merchantPaymentId": uuidv4(),
        "userAuthorizationId": "1609155081",
        "amount": {
            "amount": 1,
            "currency": "JPY"
        },
        "requestedAt": new Date().getTime(),
    }

    const response = {
        "resultInfo": { "code": "SUCCESS", "message": "Success", "codeId": "08100001" },
        "data": {
            "paymentId": "1609155081",
            "status": "COMPLETED",
            "acceptedAt": 1609155081,
            "merchantPaymentId": "testId",
            "userAuthorizationId": "1609155081",
            "amount": {
                "amount": 1,
                "currency": "JPY"
            },
            "requestedAt": 1609155080,
            "assumeMerchant": "1609155081"
        }
    }



    const mockHttpsCall = jest.spyOn(httpsClient, 'httpsCall');
    mockHttpsCall.mockImplementation(jest.fn((_options: any, _payload = '', _callback: any) => {
        _callback(response);
    }));

    await payPayRestSDK.createPayment(payload, (result: any) => {
        expect(result).toEqual(response);
    });

    expect(mockHttpsCall).toHaveBeenCalledTimes(1);
    expect(mockHttpsCall).toHaveBeenCalledWith(expect.anything(), payload, expect.anything());

    mockHttpsCall.mockClear();
});

test('Unit Test - Create Payment with agreeSimilarTransaction', async () => {

    const payload = {
        "merchantPaymentId": uuidv4(),
        "userAuthorizationId": "1609155081",
        "agreeSimilarTransaction": true,
        "amount": {
            "amount": 1,
            "currency": "JPY"
        },
        "requestedAt": new Date().getTime(),
    }

    const response = {
        "resultInfo": { "code": "SUCCESS", "message": "Success", "codeId": "08100001" },
        "data": {
            "paymentId": "1609155081",
            "status": "COMPLETED",
            "acceptedAt": 1609155081,
            "merchantPaymentId": "testId",
            "userAuthorizationId": "1609155081",
            "amount": {
                "amount": 1,
                "currency": "JPY"
            },
            "requestedAt": 1609155080,
            "assumeMerchant": "1609155081"
        }
    }
    
    const mockHttpsCall = jest.spyOn(httpsClient, 'httpsCall');
    mockHttpsCall.mockImplementation(jest.fn((options: any, payload = '', _callback: any) => {
        expect(options.path).toMatch("agreeSimilarTransaction=1")
        expect(payload).toEqual(expect.not.objectContaining({"agreeSimilarTransaction": true}))
        _callback(response);
    }));

    await payPayRestSDK.createPayment(payload, (result: any) => {
        expect(result).toEqual(response);
    });

    expect(mockHttpsCall).toHaveBeenCalledTimes(1);
    expect(mockHttpsCall).toHaveBeenCalledWith(expect.anything(), payload, expect.anything());

    mockHttpsCall.mockClear();
});
