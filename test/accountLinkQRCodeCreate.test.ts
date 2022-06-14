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

test('Unit Test - Account Link Create QR code', async () => {

    const response = {
        "amount": "10.00",
        "codeType": "SUCCESS",
        "merchantPaymentId": "93787898",
        "orderDescription": "Test Description"
    };

    const payload = {
        scopes: [
            "direct_debit"
        ],
        nonce: "34rsf323432",
        redirectType: "WEB_LINK",
        redirectUrl: "https://redirect.url",
        referenceId: "3434234234",
        phoneNumber: "3764347432",
        deviceId: "34534534",
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3 like Mac OS X) AppleWebKit/602.1.50 (KHTML, like Gecko) CriOS/56.0.2924.75 Mobile/14E5239e Safari/602.1'

    };

    const mockHttpsCall = jest.spyOn(httpsClient, 'httpsCall');
    mockHttpsCall.mockImplementation(jest.fn((_options: any, _payload = '', _callback: any) => {
        _callback(response);
    }));

    await payPayRestSDK.accountLinkQRCodeCreate(payload, (result: any) => {
        expect(result).toEqual(response);
    });

    expect(mockHttpsCall).toHaveBeenCalledTimes(1);
    expect(mockHttpsCall).toHaveBeenCalledWith(expect.anything(), payload, expect.anything());

    mockHttpsCall.mockClear();
});
