import VueRouter from 'vue-router';
import Plugin from './Plugin';

export default class VueRouterPlugin extends Plugin {
  init() {

    this.routerConfig = {};
    this.routerConfig.scrollBehavior = () => ({ y: 0 });
    this.routerConfig.mode = 'hash';
    this.routerConfig.routes = [];

    // u can set up cfg before router instance.
    this.initRouterConfig();

    //
    this.router = new VueRouter(this.routerConfig);
    const routesLength = this.routerConfig.routes.length;
    const lastRoute = this.routerConfig.routes[routesLength-1];
    // why the last one.
    if(routesLength && !lastRoute.children) {
      lastRoute.children = this._loadPages();
    } else {
      console.log('No route configured!');
    }

    // beforeEach hook, u can customer biz logic.
    this.router.beforeEach((to, from, next) => {
      if (!this.app.isProduction) {
        console.info('route before enter', to);
      }
      this.updateTitle(to, from);

      if(this.beforeEach(to, from, next)){
        next();
      }
    });

    // after hook, u can customer biz logic.
    this.router.afterEach((to, from) => {
      if (!this.app.isProduction) {
        console.info('route after enter', to);
      }
      this.afterEach(to, from);
    });
  }

  updateTitle(to, from) {
    if (to.meta && to.meta.title) {
      this.document.title = to.meta.title;
    }
  }

  initRouterConfig() {
  }

  beforeEach(to, from, next) {
    return true;
  }

  afterEach(to, from){
  }

  _loadPages(){
    // pages 目录下 取拥有index.vue文件的目录作为route path 和 route name;
    const pagesDir = require.context('../../pages', true, /index\.vue$/); // 不支持变量传路径
    const getPageName = filePath => filePath.slice(2, 10);

    const loadPage = (pageModule, async) => {
      if (async) return () => import(`../../pages/${pageModule.name}/index.vue`); // 不支持动态异步
      return pageModule.default;
    };

    return pagesDir.keys().map((filePath) => {
      const pageModule = pagesDir(filePath);
      const pageName = getPageName(filePath);
      pageModule.name = pageName;
      return {
        path: pageName,
        name: pageName,
        // meta 是用来 做元数据的
        meta: pageModule.default.meta || {},
        component: loadPage(pageModule),
      };
    });
  }
}
