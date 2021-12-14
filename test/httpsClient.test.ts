import { httpsClient } from "../src/lib/httpsClient";

jest.mock("https", () => ({
    __esModule: true,
    request: httpsRequestMock = jest.fn(() => {
        return {
            on: jest.fn(),
            write: jest.fn(),
            end: jest.fn(),
        };
    }),
}));

var httpsRequestMock: any;

test("httpsClient.httpsCall 200 handle empty response", () => {
    jest.clearAllMocks();

    const options = { apiKey: "options", path: "/some/path", method: "POST" };
    const payload = { payload: true };

    const expectedBodyChunks: string[] = [];
    const expected = { STATUS: 200, BODY: null };

    const callback = jest.fn();

    httpsClient.httpsCall(options, payload, callback);

    expect(httpsRequestMock).toHaveBeenCalledWith({ path: "/some/path", method: "POST" }, expect.anything());
    expect("apiKey" in options).toEqual(false);

    const req = httpsRequestMock.mock.results[0].value;

    // Error listener must be set up.
    expect(req.on).toHaveBeenCalledWith("error", expect.anything());
    expect(req.write).toHaveBeenCalledWith(JSON.stringify(payload));
    expect(req.end).toHaveBeenCalled();

    const res = {
        statusCode: 200,
        setEncoding: jest.fn(),
        on: jest.fn(),
    };
    const resCallback = httpsRequestMock.mock.calls[0][1];
    resCallback(res);

    expect(res.setEncoding).toHaveBeenCalledWith("utf8");
    expect(res.on).toHaveBeenCalledWith("data", expect.anything());
    expect(res.on).toHaveBeenCalledWith("end", expect.anything());

    // The data is received chunk-by-chunk.
    const onDataCallback = res.on.mock.calls[0];
    expect(onDataCallback[0]).toEqual("data");
    for (const chunk of expectedBodyChunks) {
        onDataCallback[1](chunk);

        // The callback is not invoked until the response is completed.
        expect(callback).toHaveBeenCalledTimes(0);
    }

    const onEndCallback = res.on.mock.calls[1];
    expect(onEndCallback[0]).toEqual("end");
    onEndCallback[1]();

    // The passed callback is invoked after the on-end event.
    expect(callback).toHaveBeenCalledWith(expected);
});

test("httpsClient.httpsCall POST 200", () => {
    jest.clearAllMocks();

    const options = { apiKey: "options", path: "/some/path", method: "POST" };
    const payload = { payload: true };

    const expectedBodyChunks = ["{", "\"", "k", "\": ", "1}"];
    const expected = { STATUS: 200, BODY: { k: 1 } };

    const callback = jest.fn();

    httpsClient.httpsCall(options, payload, callback);

    expect(httpsRequestMock).toHaveBeenCalledWith({ path: "/some/path", method: "POST" }, expect.anything());
    expect("apiKey" in options).toEqual(false);

    const req = httpsRequestMock.mock.results[0].value;

    // Error listener must be set up.
    expect(req.on).toHaveBeenCalledWith("error", expect.anything());
    expect(req.write).toHaveBeenCalledWith(JSON.stringify(payload));
    expect(req.end).toHaveBeenCalled();

    const res = {
        statusCode: 200,
        setEncoding: jest.fn(),
        on: jest.fn(),
    };
    const resCallback = httpsRequestMock.mock.calls[0][1];
    resCallback(res);

    expect(res.setEncoding).toHaveBeenCalledWith("utf8");
    expect(res.on).toHaveBeenCalledWith("data", expect.anything());
    expect(res.on).toHaveBeenCalledWith("end", expect.anything());

    // The data is received chunk-by-chunk.
    const onDataCallback = res.on.mock.calls[0];
    expect(onDataCallback[0]).toEqual("data");
    for (const chunk of expectedBodyChunks) {
        onDataCallback[1](chunk);

        // The callback is not invoked until the response is completed.
        expect(callback).toHaveBeenCalledTimes(0);
    }

    const onEndCallback = res.on.mock.calls[1];
    expect(onEndCallback[0]).toEqual("end");
    onEndCallback[1]();

    // The passed callback is invoked after the on-end event.
    expect(callback).toHaveBeenCalledWith(expected);

    // Prior to version 2, the SDK returned a string instead of an object.
    // For compatibility, ensure that `JSON.parse(response.BODY)` still works.
    const call = callback.mock.calls[0];
    expect(JSON.parse(call[0].BODY)).toEqual(expected.BODY);
});
