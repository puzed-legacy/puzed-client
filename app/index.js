const EventEmitter = require('events');
const routemeup = require('routemeup');

module.exports = function (config) {
  const eventEmitter = new EventEmitter();

  const app = {
    state: {
      loading: 0,
      oauthToken: window.localStorage.getItem('oauthToken'),
      loggedIn: window.localStorage.getItem('oauthToken'),

      projects: []
    }
  };

  async function changeUrl () {
    const route = routemeup(routes, { url: window.location.pathname });

    app.state.page = route ? await route.controller() : 'notFound';
    app.state.tokens = route ? route.tokens : {};

    if (app.state.page) {
      eventEmitter.emit('stateChanged', { force: true });
    }
  }

  const routes = {
    '/': () => 'home',
    '/projects': () => 'listProjects',
    '/projects/create': () => 'createProject',
    '/projects/:projectId': () => 'readProject',
    '/auth': require('./auth/loginHandler').bind(null, app)
  };

  function emitStateChanged () {
    eventEmitter.emit('stateChanged');
  }

  function setLoadingState () {
    app.state.loading = app.state.loading + 1;
    app.eventEmitter.emit('stateChanged');
  }

  function unsetLoadingState () {
    app.state.loading = app.state.loading - 1;
    app.eventEmitter.emit('stateChanged');
  }

  app.eventEmitter = eventEmitter;
  app.config = config;

  app.emitStateChanged = emitStateChanged;

  app.listRepositories = require('./repositories/list');
  app.listProjects = require('./projects/list');
  app.readProject = require('./projects/read');
  app.createProject = require('./projects/create');

  app.changeUrl = changeUrl;

  app.setLoadingState = setLoadingState;
  app.unsetLoadingState = unsetLoadingState;

  app.on = eventEmitter.addListener.bind(eventEmitter);
  app.off = eventEmitter.removeListener.bind(eventEmitter);

  window.app = app;

  require('./auth/getUser')(app);

  return app;
};
