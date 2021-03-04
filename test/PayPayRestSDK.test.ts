import PayPay from "../src";



test('Unit Test - Check the different fields between two RestSDK instances', async () => {
    const conf1 = {
        clientId: 'clientId1',
        clientSecret: 'clientSecret1',
        merchantId: '2473982',
        productionMode: false
    };
    const client1 = new PayPay.PayPayRestSDK();
    client1.configure(conf1)

    const conf2 = {
        clientId: 'clientId2',
        clientSecret: 'clientSecret2',
        merchantId: '3429854',
        productionMode: true
    };
    const client2 = new PayPay.PayPayRestSDK();
    client2.configure(conf2)

    expect(client1['auth']).not.toEqual(client2['auth']);
    expect(client1['config']).not.toEqual(client2['config']);
});
