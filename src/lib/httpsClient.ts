import * as https from "https";

class HttpsClient {
  constructor() {}

  httpsCall(options: any, payload = "", callback: any) {
    let body = "";
    let status = "";
    const req = https.request(options, (res) => {
      let status = res.statusCode;
      res.setEncoding("utf8");
      res.on("data", (chunk) => {
        body += Buffer.from(chunk);
      });
      res.on("end", () => {
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
