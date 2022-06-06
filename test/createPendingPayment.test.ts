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

test('Unit Test - Create Pending Payment', async () => {

    const payload = {
        merchantPaymentId: "343423",
        userAuthorizationId: "24234242424",
        amount: {
            amount: 10.00,
            currency: "JPY"
        },
        requestedAt: 2343432423,
        orderItems: [
            {
                name: "Test Item1",
                category: "Test Category1",
                quantity: 1,
                productId: "14214214",
                unitPrice: {
                    amount: 10.00,
                    currency: "JPY"
                }
            }
        ]
    }

    const response = {
        "resultInfo": {
            "code": "SUCCESS",
            "message": "Success",
            "codeId": "08100001"
        },
        "data": {
            "merchantPaymentId": "343423",
            "userAuthorizationId": "24234242424",
            "amount": {
                "amount": 10.00,
                "currency": "JPY"
            },
            "requestedAt": 2343432423,
            "orderItems": [
                {
                    "name": "Test Item1",
                    "category": "Test Category1",
                    "quantity": 1,
                    "productId": "14214214",
                    "unitPrice": {
                        "amount": 10.00,
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

    await payPayRestSDK.createPendingPayment(payload, (result: any) => {
        expect(result).toEqual(response);
    });

    expect(mockHttpsCall).toHaveBeenCalledTimes(1);
    expect(mockHttpsCall).toHaveBeenCalledWith(expect.anything(), payload, expect.anything());

    mockHttpsCall.mockClear();
});
