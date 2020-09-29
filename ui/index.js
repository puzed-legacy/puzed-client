const mithril = require('mithril');
const html = require('hyperx')(mithril);
const pushStateAnchors = require('spath/pushStateAnchors');
require('./modules/onUrlChange');
window.m = mithril;

const pages = {
  home: require('./pages/home'),
  login: require('./pages/login'),
  listServices: require('./pages/listServices'),
  readService: require('./pages/readService'),
  createService: require('./pages/createService'),
  notFound: require('./pages/notFound')
};

module.exports = function (app, container) {
  document.addEventListener('click', pushStateAnchors());
  window.addEventListener('locationchange', app.changeUrl);
  app.changeUrl();

  let currentPage;
  function render (data) {
    if (!app.state.page) {
      return;
    }

    const page = pages[app.state.page] || pages.notFound;

    if (currentPage !== page) {
      currentPage = page;
      const content = page(app, html);

      mithril.mount(container, content);
    }

    mithril.redraw();
  }

  app.on('stateChanged', render);
  render();
};
