import * as https from "https";

class HttpsClient {
  constructor() { }

  httpsCall(options: any, payload = "", callback: any) {
    let body = "";
    let status = "";
    const api_Name = options.apiKey;
    // Delete key to avoid any potential errors
    delete options.apiKey;
    const req = https.request(options, (res) => {
      let status = res.statusCode;
      res.setEncoding("utf8");
      res.on("data", (chunk) => {
        body += Buffer.from(chunk);
      });
      res.on("end", () => {
        if (status < 200  || status > 299 ) {
          const parseBody =  JSON.parse(body);
          const code = parseBody.resultInfo.code;
          const codeId = parseBody.resultInfo.codeId;
          const RESOLVE_URL = `https://developer.paypay.ne.jp/develop/resolve?api_name=${api_Name}&code=${code}&code_id=${codeId}`;
          console.log(`This link should help you to troubleshoot the error: ${RESOLVE_URL}`);
        }
        callback({ STATUS: status, BODY: body });
      });
    });

    req.on("error", (e) => {
      console.log('exception: ', e);

      // const RESOLVE_URL = `https://developer.paypay.ne.jp/develop/resolve?api_name=${}&code=${}&code_id=${}`
      // console.log(`This link should help you to troubleshoot the error: ${RESOLVE_URL}`)
      callback({ STATUS: status, ERROR: e.message });
    });

    if (options.method === "POST") {
      req.write(JSON.stringify(payload));
    }
    req.end();
  }
}

export const httpsClient = new HttpsClient();
