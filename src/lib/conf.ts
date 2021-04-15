import * as stagingConfig from "./conf.stage.json";
import * as prodConfig from "./conf.prod.json";
import * as perfConfig from "./conf.perf.json";

export interface Config {
  HOST_NAME: string;
  PORT_NUMBER?: number;
  API_PAYMENT: {};
  API_WALLET: {};
  API_DIRECT_DEBIT: {};
  API_APP_INVOKE: {};
  API_WEB_CASHIER: {};
  API_ACCOUNT_LINK: {};
  API_SUBSCRIPTION: {};
}

export class Conf {
  options: { [k: string]: any } = {};

  private readonly stagingConfig: Config = stagingConfig;
  private readonly prodConfig: Config = prodConfig;
  private readonly perfConfig: Config = perfConfig;

  private readonly configLookup: any;

  constructor(productionMode: boolean = false) {
    if (productionMode) {
      this.configLookup = JSON.parse(JSON.stringify(this.prodConfig));
    } else {
      this.configLookup = JSON.parse(JSON.stringify(this.stagingConfig));
    }
    if (perfMode) {
      this.configLookup = JSON.parse(JSON.stringify(this.perfConfig));
    }
  }

  setHttpsOptions(options: any) {
    this.options = options;
  }

  getHttpsOptions() {
    return this.options;
  }

  getHttpsMethod(nameApi: any, nameMethod: any): any {
    return this.configLookup[nameApi][nameMethod].METHOD;
  }

  getHttpsPath(nameApi: string | number, nameMethod: string | number) {
    return this.configLookup[nameApi][nameMethod].PATH;
  }

  getApiKey(nameApi: string | number, nameMethod: string | number) {
    return this.configLookup[nameApi][nameMethod].API_NAME;
  }

  getHostname() {
    return this.configLookup.HOST_NAME;
  }

  getPortNumber() {
    return this.configLookup.PORT_NUMBER ? this.configLookup.PORT_NUMBER : 443;
  }
}
