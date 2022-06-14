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

test('Unit Test - Get Code Payment Details', async () => {

    const merchantPaymentId = [12393849];
    const response = {
        "resultInfo": {
            "code": "SUCCESS",
            "message": "Success",
            "codeId": "08100001"
        },
        "data": {
            "paymentId": "343432",
            "status": "CREATED",
            "acceptedAt": 43453453,
            "refunds": {
                "data": [
                    {
                        "status": "CREATED",
                        "acceptedAt": 3432432,
                        "merchantRefundId": "78967765",
                        "paymentId": "43454354",
                        "amount": {
                            "amount": 12.50,
                            "currency": "JPY"
                        },
                        "requestedAt": 34324324,
                        "reason": "Test reason"
                    }
                ]
            },
            "captures": {
                "data": [
                    {
                        "acceptedAt": 32434324,
                        "merchantCaptureId": "65754644",
                        "amount": {
                            "amount": 34.75,
                            "currency": "JPY"
                        },
                        "orderDescription": "Test description",
                        "requestedAt": 5453545,
                        "expiresAt": 43545435,
                        "status": "USER_REQUESTED"
                    }
                ]
            },
            "revert": {
                "acceptedAt": 657674645,
                "merchantRevertId": "453432432",
                "requestedAt": 546544645,
                "reason": "Test reason"
            },
            "merchantPaymentId": "454354354",
            "userAuthorizationId": "456345343656",
            "amount": {
                "amount": 76.50,
                "currency": "JPY"
            },
            "requestedAt": 3435435234,
            "expiresAt": 4354534534,
            "canceledAt": 23435435,
            "storeId": "534534",
            "terminalId": "345345",
            "orderReceiptNumber": "234234",
            "orderDescription": "Test description",
            "orderItems": [
                {
                    "name": "Test Item",
                    "category": "Test Category",
                    "quantity": 1,
                    "productId": "23432423",
                    "unitPrice": {
                        "amount": 68.00,
                        "currency": "JPY"
                    }
                }
            ],
            "metadata": {}
        }
    }


    const mockHttpsCall = jest.spyOn(httpsClient, 'httpsCall');
    mockHttpsCall.mockImplementation(jest.fn((_options: any, _payload = '', _callback: any) => {
        _callback(response);
    }));

    await payPayRestSDK.getCodePaymentDetails(merchantPaymentId, (result: any) => {
        expect(result).toEqual(response);
    });

    expect(mockHttpsCall).toHaveBeenCalledTimes(1);

    mockHttpsCall.mockClear();
});
