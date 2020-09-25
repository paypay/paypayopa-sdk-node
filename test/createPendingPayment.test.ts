import { payPayRestSDK } from "../src/lib/paypay-rest-sdk";
import { httpsClient } from '../src/lib/httpsClient';

const conf = {
    clientId: '5345435fsdfsr54353454',
    clientSecret: 'dgfgdfgt46435gsdr35tte5',
    merchantId: '2473982',
    productionMode: false
};

payPayRestSDK.configure(conf);

test('Unit Test - Create Pending Payment', async () => {

    const payload = {
        merchantPaymentId: "string",
        userAuthorizationId: "string",
        amount: {
            amount: 0,
            currency: "JPY"
        },
        requestedAt: 0,
        expiryDate: null,
        storeId: "string",
        terminalId: "string",
        orderReceiptNumber: "string",
        orderDescription: "string",
        orderItems: [
            {
                name: "string",
                category: "string",
                quantity: 1,
                productId: "string",
                unitPrice: {
                    amount: 0,
                    currency: "JPY"
                }
            }
        ],
        metadata: {}
    }

    const response = {
        "resultInfo": {
            "code": "string",
            "message": "string",
            "codeId": "string"
        },
        "data": {
            "merchantPaymentId": "string",
            "userAuthorizationId": "string",
            "amount": {
                "amount": 0,
                "currency": "JPY"
            },
            "requestedAt": 0,
            "expiryDate": null,
            "storeId": "string",
            "terminalId": "string",
            "orderReceiptNumber": "string",
            "orderDescription": "string",
            "orderItems": [
                {
                    "name": "string",
                    "category": "string",
                    "quantity": 1,
                    "productId": "string",
                    "unitPrice": {
                        "amount": 0,
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
