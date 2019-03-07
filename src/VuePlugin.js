import Vue from 'vue';
import Plugin from './Plugin';

export default class VuePlugin extends Plugin {
  // after all plugin init here vue use the last step inited for full feature support.
  init() {
    const { app } = this;

    this.VueApp = null;
    this.vueRouter = null;
    this.vueDoom = '#app';
    this.vueNode = null;

    this._loadComponents();
  }

  // here will call by app ready call back.
  initVueNode() {
    if (this.vueNode) {
      throw new Error('U have already amount vue node');
    }

    if (!this.VueApp) {
      throw new Error('U need set the vueApp class first');
    }

    if (!this.vueRouter) {
      throw new Error('U need set the vueRouter instance first');
    }
    // init root vm
    this.vueNode = new this.Vue({
      router: this.vueRouter,
      render: h => h(this.VueApp),
    }).$mount(this.vueDoom);
  }

  _loadComponents() {
    // components 目录下 取拥有index.vue文件的目录作为components 和 components name;
    const componentsDir = require.context('../../components', true, /index\.vue$/); // 不支持变量传路径

    // filepath is './auth-verify-dialog/index.vue' like
    componentsDir.keys()
      .filter(filePath => {
        // 特殊规则过滤掉列外的
        if (filePath.startsWith('./_')) return false;
      })
      .forEach((filePath) => {
      const module = componentsDir(filePath);
      const moduleName = filePath.slice(2, -4);
      module.name = moduleName;
      Vue.component(module.name, module.default);
    });
  }
}

