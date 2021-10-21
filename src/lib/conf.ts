import * as pathConfig from "./conf.path.json";
import { HOST_PATH } from "./constants";

export interface Config {
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
  private readonly pathConfig: Config = pathConfig;

  private readonly configLookup: any;

  constructor(productionMode: boolean = false, perfMode: boolean) {
    this.configLookup = JSON.parse(JSON.stringify(this.pathConfig));
    if (productionMode) {
      this.configLookup.HOST_NAME = HOST_PATH.PROD
    } else {
      this.configLookup.HOST_NAME = HOST_PATH.STAGING;
    }
    if (perfMode) {
      this.configLookup.HOST_NAME = HOST_PATH.PERF_MODE;
    }
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
