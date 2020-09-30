/*
 * Handles authentication here.
 * If API exists to return error for client credentials, throw error,
 * Right now, we don't have any such checks, this is a dummy file
 */

class Auth {
  clientId: string;
  clientSecret: string;
  merchantId?: string;
  /**
   * Set intial values to empty string
   */
  constructor() {
    this.clientId = "";
    this.clientSecret = "";
    this.merchantId = "";
  }

  /**
   * Set authentication without any validation
   * @param  {String}   clientId      API_KEY provided by client
   * @param  {String}   clientSecret  API_SECRET provided by client
   */
  setAuth(clientId: string, clientSecret: string, merchantId?: string) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.merchantId = merchantId;
  }
}

export let auth = new Auth();
