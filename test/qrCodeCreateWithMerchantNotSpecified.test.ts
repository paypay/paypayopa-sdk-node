import { payPayRestSDK } from "../src/lib/paypay-rest-sdk";
import { httpsClient } from '../src/lib/httpsClient';

const conf = {
    clientId: '5345435fsdfsr54353454',
    clientSecret: 'dgfgdfgt46435gsdr35tte5',
    productionMode: false
};

payPayRestSDK.configure(conf);

test('Unit Test - Create QR code without specifying the merchant id', async () => {

    const payload = {
        merchantPaymentId: '2312324',
        amount: {
            amount: 1,
            currency: 'JPY',
        },
        codeType: 'ORDER_QR',
        orderDescription: 'Test Description',
        isAuthorization: false,
        redirectUrl: 'https://test.redirect.url/',
        redirectType: 'WEB_LINK',
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3 like Mac OS X) AppleWebKit/602.1.50 (KHTML, like Gecko) CriOS/56.0.2924.75 Mobile/14E5239e Safari/602.1'
    };

    const response = {
        "resultInfo": {
            "code": "SUCCESS",
            "message": "Success",
            "codeId": "08100001"
        },
        "data": {
            "codeId": "08100001",
            "url": "https://test.url/",
            "deeplink": "https://test.deeplink",
            "expiryDate": 3213232,
            "merchantPaymentId": "342423423",
            "amount": {
                "amount": 10.50,
                "currency": "JPY"
            },
            "orderDescription": "Test Description",
            "orderItems": [
                {
                    "name": "Test Item",
                    "category": "Test Category",
                    "quantity": 1,
                    "productId": "349329",
                    "unit_price": {
                        "amount": 10.50,
                        "currency": "JPY"
                    }
                }
            ],
            "metadata": {},
            "requestedAt": 2131312,
            "redirectUrl": "https://test.redirect.url/",
            "redirectType": "WEB_LINK",
            "isAuthorization": true,
            "authorizationExpiry": null
        }
    };

    const mockHttpsCall = jest.spyOn(httpsClient, 'httpsCall');
    mockHttpsCall.mockImplementation(jest.fn((_options: any, _payload = '', _callback: any) => {
        _callback(response);
    }));

    await payPayRestSDK.qrCodeCreate(payload, (result: any) => {
        expect(result).toEqual(response);
    });

    expect(mockHttpsCall).toHaveBeenCalledTimes(1);
    expect(mockHttpsCall).toHaveBeenCalledWith(expect.anything(), payload, expect.anything());

    mockHttpsCall.mockClear();
});
