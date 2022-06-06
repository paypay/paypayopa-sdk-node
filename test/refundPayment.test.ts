import { payPayRestSDK } from "../src/lib/paypay-rest-sdk";
import { HttpsClient } from '../src/lib/httpsClient';

const conf = {
    clientId: '5345435fsdfsr54353454',
    clientSecret: 'dgfgdfgt46435gsdr35tte5',
    merchantId: '2473982',
};

payPayRestSDK.configure(conf);

const httpsClient = new HttpsClient();
payPayRestSDK.setHttpsClient(httpsClient);

test('Unit Test - Refund Payment', async () => {

    const payload = {
        merchantRefundId: "343432432",
        paymentId: "454354354",
        amount: {
            amount: 12.50,
            currency: "JPY"
        },
        requestedAt: 342342342,
        reason: "Test Reason"
    }

    const response = {
        "resultInfo": {
            "code": "SUCCESS",
            "message": "Success",
            "codeId": "08100001"
        },
        "data": {
            "status": "CREATED",
            "acceptedAt": 3243242324,
            "merchantRefundId": "343432432",
            "paymentId": "454354354",
            "amount": {
                "amount": 12.50,
                "currency": "JPY"
            },
            "requestedAt": 342342342,
            "reason": "Test Reason"
        }
    };

    const mockHttpsCall = jest.spyOn(httpsClient, 'httpsCall');
    mockHttpsCall.mockImplementation(jest.fn((_options: any, _payload = '', _callback: any) => {
        _callback(response);
    }));

    await payPayRestSDK.paymentRefund(payload, (result: any) => {
        expect(result).toEqual(response);
    });

    expect(mockHttpsCall).toHaveBeenCalledTimes(1);
    expect(mockHttpsCall).toHaveBeenCalledWith(expect.anything(), payload, expect.anything());

    mockHttpsCall.mockClear();
});
