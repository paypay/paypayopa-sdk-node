import { payPayRestSDK } from "../src/lib/paypay-rest-sdk";
import { httpsClient } from '../src/lib/httpsClient';

const conf = {
    clientId: 'test',
    clientSecret: 'test',
    merchantId: '2473982',
    productionMode: false
};

payPayRestSDK.configure(conf);

test('Unit Test - Check cashback reversal details', async () => {

    const merchantPaymentId = [12393849];
    const response = {
        STATUS: 200,
        BODY: {
            "resultInfo": {
                "code": "SUCCESS",
                "message": "Success",
                "codeId": "08100001",
            },
            "data": {
                "status": "SUCCESS",
                "acceptedAt": 1611747702,
                "merchantAlias": "test",
                "amount": { "amount": 1, "currency": "JPY" },
                "requestedAt": 1611747699,
                "metadata": "",
                "cashbackReversalId": "test",
                "merchantCashbackReversalId": "test",
                "merchantCashbackId": "test",
            },
        },
    };

    const mockHttpsCall = jest.spyOn(httpsClient, 'httpsCall');
    mockHttpsCall.mockImplementation(jest.fn((_options: any, _payload = '', _callback: any) => {
        _callback(response);
    }));

    await payPayRestSDK.getReverseCashBackDetails(merchantPaymentId, (result: any) => {
        expect(result).toEqual(response);
    });

    expect(mockHttpsCall).toHaveBeenCalledTimes(1);

    mockHttpsCall.mockClear();
});
