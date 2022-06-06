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

test('Unit Test - Check that default environment is sandbox', async () => {
    const client = new PayPay.PayPayRestSDK();
    client.configure({ clientId: 'client1', clientSecret: 'clientSecret' });

    const mockHttpsClient = {
        httpsCall: jest.fn(),
        printDebugMessage: () => { },
    };
    client.setHttpsClient(mockHttpsClient);

    client.createPayment({});

    expect(mockHttpsClient.httpsCall.mock.calls.length).toBe(1);
    const call = mockHttpsClient.httpsCall.mock.calls[0];
    expect(call[0].hostname).toContain('stg');
});

test('Unit Test - Check that STAGING environment is sandbox', async () => {
    const client = new PayPay.PayPayRestSDK();
    client.configure({
        env: 'STAGING',
        clientId: 'client1',
        clientSecret: 'clientSecret',
    });

    const mockHttpsClient = {
        httpsCall: jest.fn(),
        printDebugMessage: () => { },
    };
    client.setHttpsClient(mockHttpsClient);

    client.createPayment({});

    expect(mockHttpsClient.httpsCall.mock.calls.length).toBe(1);
    const call = mockHttpsClient.httpsCall.mock.calls[0];
    expect(call[0].hostname).toContain('stg');
});

test('Unit Test - Check that PROD environment is production', async () => {
    const client = new PayPay.PayPayRestSDK();
    client.configure({
        env: 'PROD',
        clientId: 'client1',
        clientSecret: 'clientSecret',
    });

    const mockHttpsClient = {
        httpsCall: jest.fn(),
        printDebugMessage: () => { },
    };
    client.setHttpsClient(mockHttpsClient);

    client.createPayment({});

    expect(mockHttpsClient.httpsCall.mock.calls.length).toBe(1);
    const call = mockHttpsClient.httpsCall.mock.calls[0];
    expect(call[0].hostname).toBe('api.paypay.ne.jp');
});

test('Unit Test - Check that PERF_MODE environment is perf', async () => {
    const client = new PayPay.PayPayRestSDK();
    client.configure({
        env: 'PERF_MODE',
        clientId: 'client1',
        clientSecret: 'clientSecret',
    });

    const mockHttpsClient = {
        httpsCall: jest.fn(),
        printDebugMessage: () => { },
    };
    client.setHttpsClient(mockHttpsClient);

    client.createPayment({});

    expect(mockHttpsClient.httpsCall.mock.calls.length).toBe(1);
    const call = mockHttpsClient.httpsCall.mock.calls[0];
    expect(call[0].hostname).toContain('perf');
});

test('Unit Test - Check that deprecated perfMode is perf', async () => {
    const client = new PayPay.PayPayRestSDK();
    client.configure({
        perfMode: true,
        clientId: 'client1',
        clientSecret: 'clientSecret',
    });

    const mockHttpsClient = {
        httpsCall: jest.fn(),
        printDebugMessage: () => { },
    };
    client.setHttpsClient(mockHttpsClient);

    client.createPayment({});

    expect(mockHttpsClient.httpsCall.mock.calls.length).toBe(1);
    const call = mockHttpsClient.httpsCall.mock.calls[0];
    expect(call[0].hostname).toBe('perf-api.paypay.ne.jp');
});

test('Unit Test - Check that deprecated productionMode is prod', async () => {
    const client = new PayPay.PayPayRestSDK();
    client.configure({
        productionMode: true,
        clientId: 'client1',
        clientSecret: 'clientSecret',
    });

    const mockHttpsClient = {
        httpsCall: jest.fn(),
        printDebugMessage: () => { },
    };
    client.setHttpsClient(mockHttpsClient);

    client.createPayment({});

    expect(mockHttpsClient.httpsCall.mock.calls.length).toBe(1);
    const call = mockHttpsClient.httpsCall.mock.calls[0];
    expect(call[0].hostname).toBe('api.paypay.ne.jp');
});
