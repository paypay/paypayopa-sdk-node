import { payPayRestSDK } from "../src/lib/paypay-rest-sdk";
import { httpsClient } from '../src/lib/httpsClient';

const conf = {
    clientId: '5345435fsdfsr54353454',
    clientSecret: 'dgfgdfgt46435gsdr35tte5',
    merchantId: '2473982',
    productionMode: false
};

payPayRestSDK.configure(conf);

test('Unit Test - Refund Pending Payment', async () => {

    const payload = {
        merchantRefundId: "string",
        paymentId: "string",
        amount: {
            amount: 0,
            currency: "JPY"
        },
        requestedAt: 0,
        reason: "string"
    };

    const response = {
        "resultInfo": {
            "code": "string",
            "message": "string",
            "codeId": "string"
        },
        "data": {
            "status": "CREATED",
            "acceptedAt": 0,
            "merchantRefundId": "string",
            "paymentId": "string",
            "amount": {
                "amount": 0,
                "currency": "JPY"
            },
            "requestedAt": 0,
            "reason": "string"
        }
    };

    const mockHttpsCall = jest.spyOn(httpsClient, 'httpsCall');
    mockHttpsCall.mockImplementation(jest.fn((_options: any, _payload = '', _callback: any) => {
        _callback(response);
    }));

    await payPayRestSDK.refundPendingPayment(payload, (result: any) => {
        expect(result).toEqual(response);
    });

    expect(mockHttpsCall).toHaveBeenCalledTimes(1);
    expect(mockHttpsCall).toHaveBeenCalledWith(expect.anything(), payload, expect.anything());

    mockHttpsCall.mockClear();
});
