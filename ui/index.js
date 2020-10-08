const mithril = require('mithril');
const html = require('hyperx')(mithril);
const pushStateAnchors = require('spath/pushStateAnchors');
require('./modules/onUrlChange');
window.m = mithril;

const pages = {
  home: require('./pages/home'),
  login: require('./pages/user/login'),
  register: require('./pages/user/register'),
  createDomain: require('./pages/domains/create'),
  listDomains: require('./pages/domains/list'),
  createLink: require('./pages/links/create'),
  listLinks: require('./pages/links/list'),
  listServices: require('./pages/services/list'),
  readService: require('./pages/services/read'),
  createService: require('./pages/services/create'),
  loading: require('./pages/loading'),
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

      const autoFocusedElement = document.querySelector('[autofocus]');
      autoFocusedElement && autoFocusedElement.focus();
    }

    mithril.redraw();
  }

  app.on('stateChanged', render);
  render();
};
