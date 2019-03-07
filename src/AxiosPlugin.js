import axios from 'axios';
import Plugin from './Plugin';

export default class AxiosPlugin extends Plugin {
  init() {
    const { app } = this;

    app.refs.http = axios;

    this.requestHeaderKeys = ['access-token', 'device-uuid'];
    this.responseHeaderKeys = ['set-access-token'];

    this.httpConfig = axios.defaults;
    this.httpConfig.baseURL = '';

    // u can change the storage implement in sub class.
    this.storage = window.localStorage;

    // Do something before request is sent
    axios.interceptors.request.use((request) => {
      this.storageToRequestHeaders(request);
      return this.interceptRequest(request);
    }, (error) => {
      console.error(error);
      return Promise.reject(error);
    });

    //------------------------------------

    // Do something after response
    axios.interceptors.response.use((response) => {
      this.responseHeadersToStorage(response);
      return this.interceptResponseSuccess(response);
    }, (error) => {
      console.error(error);

      if (error.response) {
        this.responseHeadersToStorage(error.response);
      }
      return this.interceptResponseError(error);
    });
  }

  // api for call
  setBaseURL(url) {
    this.httpConfig.baseURL = url;
  }

  // here is the common header logic.
  storageToRequestHeaders(request) {
    // here is store in localStorage?
    this.requestHeaderKeys.forEach((headerKey) => {
      const headerVal = this.storage.getItem(headerKey);
      if (headerVal) {
        request.headers[headerKey] = headerVal;
      }
    });
  }

  responseHeadersToStorage(response) {
    // here is store in localStorage?
    this.responseHeaderKeys.forEach((headerKey) => {
      const headerVal = this.storage.getItem(headerKey);
      if (headerVal) {
        response.headers[headerKey] = headerVal;
      }
    });
  }

  // u can  override this for customer biz logic.
  // u also can response promise here.
  interceptRequest(config) {
    return config;
  }

  interceptResponseSuccess(response) {
    return response;
  }

  interceptResponseError(responseErr) {
    return Promise.reject(responseErr);
  }
}

