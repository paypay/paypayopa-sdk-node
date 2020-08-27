import { payPayRestSDK } from "../src/lib/paypay-rest-sdk";
import { httpsClient } from '../src/lib/httpsClient';

const conf = {
    clientId: '5345435fsdfsr54353454',
    clientSecret: 'dgfgdfgt46435gsdr35tte5',
    merchantId: '2473982',
    productionMode: false
};

payPayRestSDK.configure(conf);

test('Unit Test - Payment Subscription', async () => {

    const payload = {
        merchantPaymentId: "433534534",
        userAuthorizationId: "345345345",
        amount: {
            amount: 26.00,
            currency: "JPY"
        },
        requestedAt: 324324324,
        storeId: "79768776",
        terminalId: "2434534",
        orderReceiptNumber: "5754535",
        orderDescription: "Test Description",
        orderItems: [
            {
                name: "Test Item",
                category: "Test Category",
                quantity: 1,
                productId: "23432423",
                unitPrice: {
                    amount: 68.00,
                    currency: "JPY"
                }
            }
        ],
        "metadata": {}
    };

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
            "merchantPaymentId": "433534534",
            "userAuthorizationId": "345345345",
            "amount": {
                "amount": 76.50,
                "currency": "JPY"
            },
            "requestedAt": 324324324,
            "storeId": "79768776",
            "terminalId": "2434534",
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

    await payPayRestSDK.paymentSubscription(payload, (result: any) => {
        expect(result).toEqual(response);
    });

    expect(mockHttpsCall).toHaveBeenCalledTimes(1);

    mockHttpsCall.mockClear();
});
