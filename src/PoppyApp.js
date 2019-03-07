/**
 *
 */
export default class PoppyApp {

  // here plugins just a class map.
  constructor(pluginClzs) {
    this.isProduction = process.NODE_ENV === 'production';
    // here is map of plugins instance.
    this.plugins = {};

    this.isReady = false;
    this.pluginClsRefs = Object.assign({}, pluginClzs);
  }

  init(callback) {
    if (this.isReady) {
      throw new Error("u can't be init app twice!");
    }

    const { pluginClsRefs } = this;
    const pluginClsNames = Object.keys(pluginClsRefs);
    // for plugin instance
    pluginClsNames.forEach(pluginName => {
      this.plugins[pluginName] = new pluginClsRefs[pluginName];
    });

    // for plugin instance init
    pluginClsNames.forEach(pluginName => {
      this.plugins[pluginName].init();
    });

    // for plugin instance inited
    pluginClsNames.forEach(pluginName => {
      this.plugins[pluginName].inited();
    });

    if (!this.app.isProduction) {
      console.log('app plugins is: \t' + pluginClsNames.join('\t'));
    }

    if (typeof callback === 'function') {
      requestAnimationFrame(() => {
        console.log('app is ready ...');
        callback(this);
        this.isReady = true;
      });
    }
  }
}
