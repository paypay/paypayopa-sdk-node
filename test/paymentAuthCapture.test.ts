import { payPayRestSDK } from "../src/lib/paypay-rest-sdk";
import { httpsClient } from '../src/lib/httpsClient';

const conf = {
    clientId: '5345435fsdfsr54353454',
    clientSecret: 'dgfgdfgt46435gsdr35tte5',
    merchantId: '2473982',
    productionMode: false
};

payPayRestSDK.configure(conf);

test('Unit Test - Payment Auth Capture', async () => {

    const payload = {
        merchantPaymentId: '2312324',
        amount: {
            amount: 24.50,
            currency: 'JPY',
        },
        merchantCaptureId: "3432424",
        requestedAt: 324234234,
        orderDescription: "Test Description"    
    };

    const response = {
        "resultInfo": {
            "code": "SUCCESS",
            "message": "Success",
            "codeId": "08100001"
        },
        "data": {
            "paymentId": "343432",
            "status": "COMPLETED",
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
                            "amount": 24.50,
                            "currency": "JPY"
                        },
                        "orderDescription": "Test description",
                        "requestedAt": 324234234,
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
    };

    const mockHttpsCall = jest.spyOn(httpsClient, 'httpsCall');
    mockHttpsCall.mockImplementation(jest.fn((_options: any, _payload = '', _callback: any) => {
        _callback(response);
    }));

    await payPayRestSDK.paymentAuthCapture(payload, (result: any) => {
        expect(result).toEqual(response);
    });

    expect(mockHttpsCall).toHaveBeenCalledTimes(1);

    mockHttpsCall.mockClear();
});
