import { payPayRestSDK } from "../src/lib/paypay-rest-sdk";
import { HttpsClient } from '../src/lib/httpsClient';
const { v4: uuidv4 } = require('uuid');

const conf = {
    clientId: '5345435fsdfsr54353454',
    clientSecret: 'dgfgdfgt46435gsdr35tte5',
    merchantId: '2473982',
};

payPayRestSDK.configure(conf);

const httpsClient = new HttpsClient();
payPayRestSDK.setHttpsClient(httpsClient);

test('Unit Test - Preauthorize Payment', async () => {

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
            "status": "AUTHORIZED",
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
        _callback({ STATUS: 200, BODY: response });
    }));

    const expected = { STATUS: 200, BODY: response };
    const promiseResult = await payPayRestSDK.paymentPreauthorize(payload, (result: any) => {
        expect(result).toEqual(expected);
    });
    expect(promiseResult).toEqual(expected);

    expect(mockHttpsCall).toHaveBeenCalledTimes(1);
    expect(mockHttpsCall).toHaveBeenCalledWith(expect.objectContaining({ path: "/v2/payments/preauthorize?agreeSimilarTransaction=false" }), payload, expect.anything());

    mockHttpsCall.mockClear();
});

test('Unit Test - Preauthorize Payment with agreeSimilarTransaction=false', async () => {

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
            "status": "AUTHORIZED",
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
        _callback({ STATUS: 200, BODY: response });
    }));

    const expected = { STATUS: 200, BODY: response };
    const promiseResult = await payPayRestSDK.paymentPreauthorize(payload, false, (result: any) => {
        expect(result).toEqual(expected);
    });
    expect(promiseResult).toEqual(expected);

    expect(mockHttpsCall).toHaveBeenCalledTimes(1);
    expect(mockHttpsCall).toHaveBeenCalledWith(expect.objectContaining({ path: "/v2/payments/preauthorize?agreeSimilarTransaction=false" }), payload, expect.anything());

    mockHttpsCall.mockClear();
});

test('Unit Test - Preauthorize Payment with agreeSimilarTransaction=true', async () => {

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
            "status": "AUTHORIZED",
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
        _callback({ STATUS: 200, BODY: response });
    }));

    const expected = { STATUS: 200, BODY: response };
    const promiseResult = await payPayRestSDK.paymentPreauthorize(payload, true, (result: any) => {
        expect(result).toEqual(expected);
    });
    expect(promiseResult).toEqual(expected);

    expect(mockHttpsCall).toHaveBeenCalledTimes(1);
    expect(mockHttpsCall).toHaveBeenCalledWith(expect.objectContaining({ path: "/v2/payments/preauthorize?agreeSimilarTransaction=true" }), payload, expect.anything());

    mockHttpsCall.mockClear();
});
