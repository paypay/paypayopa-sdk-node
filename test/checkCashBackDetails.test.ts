import { payPayRestSDK } from "../src/lib/paypay-rest-sdk";
import { httpsClient } from '../src/lib/httpsClient';

const conf = {
    clientId: 'testId',
    clientSecret: 'testId',
    merchantId: '2473982',
    productionMode: false
};

payPayRestSDK.configure(conf);

test('Unit Test - Check cashback details', async () => {

    const merchantPaymentId = [12393849];
    const response = {
        STATUS: 200,
        BODY: '{"resultInfo":{"code":"SUCCESS","message":"Success","codeId":"08100001"},"data":{"status":"SUCCESS","acceptedAt":1611747653,"merchantAlias":"test","amount":{"amount":1,"currency":"JPY"},"requestedAt":1611747650,"metadata":"","cashbackId":"test","merchantCashbackId":"test","userAuthorizationId":"test","orderDescription":"order description","walletType":"PREPAID"}}'
    }

    const mockHttpsCall = jest.spyOn(httpsClient, 'httpsCall');
    mockHttpsCall.mockImplementation(jest.fn((_options: any, _payload = '', _callback: any) => {
        _callback(response);
    }));

    await payPayRestSDK.getCashBackDetails(merchantPaymentId, (result: any) => {
        expect(result).toEqual(response);
    });

    expect(mockHttpsCall).toHaveBeenCalledTimes(1);

    mockHttpsCall.mockClear();
});
