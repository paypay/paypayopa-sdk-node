import * as https from "https";

export interface HttpsClientSuccess {
  STATUS: number;
  BODY: string;
}

export interface HttpsClientError {
  STATUS: number;
  ERROR: string;
}

export interface HttpsClientMessage {
  (message: HttpsClientSuccess | HttpsClientError): void;
}

export class HttpsClient {
  constructor() { }

  printDebugMessage(status: number, body: string, apiName: string | undefined) {
    try {
      const parseBody = JSON.parse(body);
      const code = parseBody.resultInfo.code;
      const codeId = parseBody.resultInfo.codeId;
      const RESOLVE_URL = `https://developer.paypay.ne.jp/develop/resolve?api_name=${apiName}&code=${code}&code_id=${codeId}`;
      console.log(`This link should help you to troubleshoot the error: ${RESOLVE_URL}`);
    } catch (e) {
      console.log(`The response to ${apiName} with status ${status} had an unexpected form`);
    }
  }

  httpsCall(
    options: https.RequestOptions & { apiKey?: string },
    payload: any,
    callback: HttpsClientMessage,
  ) {
    if (payload === undefined) {
      payload = "";
    }

    let body = "";
    let status: number;
    const apiName = options.apiKey;
    delete options.apiKey; // Delete key to avoid any potential errors
    const req = https.request(options, (res) => {
      status = res?.statusCode!;
      res.setEncoding("utf8");
      res.on("data", (chunk) => {
        body += Buffer.from(chunk);
      });
      res.on("end", () => {
        if (status < 200 || status > 299) {
          this.printDebugMessage(status, body, apiName);
        }
        callback({ STATUS: status, BODY: body });
      });
    });

    req.on("error", (e) => {
      callback({ STATUS: status, ERROR: e.message });
    });

    if (options.method === "POST") {
      req.write(JSON.stringify(payload));
    }
    req.end();
  }
}

export const httpsClient = new HttpsClient();
