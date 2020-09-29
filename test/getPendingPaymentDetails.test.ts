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
            "code": "SUCCESS",
            "message": "Success",
            "codeId": "08100001"
        },
        "data": {
            "paymentId": "3243423",
            "status": "CREATED",
            "acceptedAt": 4234423,
            "refunds": {},
            "merchantPaymentId": "342343",
            "userAuthorizationId": "53453535",
            "amount": {},
            "requestedAt": 535353534,
            "storeId": "34543534",
            "terminalId": "353534",
            "orderReceiptNumber": "546546456",
            "orderDescription": "Test Description1",
            "orderItems": [
                {
                    "name": "Test Product1",
                    "category": "Test Category1",
                    "quantity": 1,
                    "productId": "3434324",
                    "unitPrice": {
                        "amount": 10,
                        "currency": "JPY"
                    }
                }
            ],
        }
    };

    const mockHttpsCall = jest.spyOn(httpsClient, 'httpsCall');
    mockHttpsCall.mockImplementation(jest.fn((_options: any, _payload = '', _callback: any) => {
        _callback(response);
    }));

    await payPayRestSDK.getPendingPaymentDetails(merchantPaymentId, (result: any) => {
        expect(result).toEqual(response);
    });

    expect(mockHttpsCall).toHaveBeenCalledTimes(1);

    mockHttpsCall.mockClear();
});
