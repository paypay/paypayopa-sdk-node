import { payPayRestSDK } from "../src/lib/paypay-rest-sdk";
import { httpsClient } from '../src/lib/httpsClient';

const conf = {
    clientId: '5345435fsdfsr54353454',
    clientSecret: 'dgfgdfgt46435gsdr35tte5',
    merchantId: '2473982',
    productionMode: false
};

payPayRestSDK.configure(conf);

test('Unit Test - Get Pending Order Details', async () => {

    const merchantPaymentId = [12393849];

    const response = {
        "resultInfo": {
            "code": "string",
            "message": "string",
            "codeId": "string"
        },
        "data": {
            "paymentId": "string",
            "status": "CREATED",
            "acceptedAt": 0,
            "refunds": {},
            "merchantPaymentId": "string",
            "userAuthorizationId": "string",
            "amount": {},
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

    await payPayRestSDK.getPendingOrderDetails(merchantPaymentId, (result: any) => {
        expect(result).toEqual(response);
    });

    expect(mockHttpsCall).toHaveBeenCalledTimes(1);

    mockHttpsCall.mockClear();
});
