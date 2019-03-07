import Plugin from './Plugin';

export default class AppConfigPlugin extends Plugin {

  init() {
    const appId = 'demo'; // APP名称

    this.appConfig = {
      appId,
      appTitle: appId,
      logoName: appId,
      logoUrl: '',
      logoRoute: '/home/dashboard',
      pageNotFoundRoute: '/home/pageNotFound',
      forbiddenRoute: '/home/forbidden',
      securityCenterRoute: '/home/securityCenter',

      mode: process.env.VUE_APP_MODE,
      defaultUsername: process.env.VUE_APP_DEFAULT_USERNAME,
      defaultPassword: process.env.VUE_APP_DEFAULT_PASSWORD,
      API: process.env.VUE_APP_BASE_API_URL,
    };

    this.appData = {};
    this.appConst = {};
  }
}
