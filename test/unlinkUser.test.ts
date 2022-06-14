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

test('Unit Test - Unlink user', async () => {
    const userAuthorizationId = [6787435345];
    const response = {
        "resultInfo": {
            "code": "SUCCESS",
            "message": "Success",
            "codeId": "08100001"
        }
    };

    const mockHttpsCall = jest.spyOn(httpsClient, 'httpsCall');
    mockHttpsCall.mockImplementation(jest.fn((_options: any, _payload = '', _callback: any) => {
        _callback(response);
    }));

    await payPayRestSDK.unlinkUser(userAuthorizationId, (result: any) => {
        expect(result).toEqual(response);
    });

    expect(mockHttpsCall).toHaveBeenCalledTimes(1);

    mockHttpsCall.mockClear();
});
