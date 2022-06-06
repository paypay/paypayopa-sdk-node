import { payPayRestSDK } from "../src/lib/paypay-rest-sdk";
import { HttpsClient } from '../src/lib/httpsClient';
const { v4: uuidv4 } = require('uuid');

const conf = {
    clientId: 'test',
    clientSecret: 'test',
    merchantId: 'test',
};

payPayRestSDK.configure(conf);

const httpsClient = new HttpsClient();
payPayRestSDK.setHttpsClient(httpsClient);

test('Unit Test - Cash Back', async () => {

    const payload = {
        "merchantCashbackId": uuidv4(),
        "userAuthorizationId": "testId",
        "amount": {
            "amount": 1,
            "currency": "JPY"
        },
        "requestedAt": 1609749559,
        "orderDescription": "order description",
        "walletType": "CASHBACK",
        "expiryDate": '2021-07-31',
        "metadata": ""
    }

    const response = {
        "resultInfo": { "code": "REQUEST_ACCEPTED", "message": "Request accepted", "codeId": "08100001" },
        "data": null,
    }



    const mockHttpsCall = jest.spyOn(httpsClient, 'httpsCall');
    mockHttpsCall.mockImplementation(jest.fn((_options: any, _payload = '', _callback: any) => {
        _callback(response);
    }));

    await payPayRestSDK.cashBack(payload, (result: any) => {
        expect(result).toEqual(response);
    });

    expect(mockHttpsCall).toHaveBeenCalledTimes(1);
    expect(mockHttpsCall).toHaveBeenCalledWith(expect.anything(), payload, expect.anything());

    mockHttpsCall.mockClear();
});
