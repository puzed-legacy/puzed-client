const EventEmitter = require('events');
const routemeup = require('routemeup');

module.exports = function (config) {
  const eventEmitter = new EventEmitter();

  const app = {
    state: {
      loading: 0,
      session: window.localStorage.getItem('session'),
      loggedIn: window.localStorage.getItem('session'),

      services: [],
      deployments: [],
      deploymentExpands: {},
      instances: [],
      instanceExpands: {},
      buildLogs: {},
      liveLogs: {},

      deploymentLogs: {}
    }
  };

  app.state.session = app.state.session ? JSON.parse(app.state.session) : null;

  function toggleExpanded (app, stateKey, id) {
    if (app.state[stateKey][id]) {
      app.state[stateKey][id] = false;
    } else {
      app.state[stateKey][id] = true;
    }

    app.emitStateChanged();
  }

  async function changeUrl () {
    const routes = {
      '/': () => 'home',
      '/login': () => 'login',
      '/services': () => 'listServices',
      '/services/create': () => 'createService',
      '/services/:serviceId': () => 'readService',
      '/providers/:providerId/oauth': require('./auth/oauthHandler').bind(null, app)
    };

    const route = routemeup(routes, { url: window.location.pathname });

    app.state.page = route ? await route.controller() : 'notFound';
    app.state.tokens = route ? route.tokens : {};

    if (app.state.page) {
      eventEmitter.emit('stateChanged', { force: true });
    }
  }

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

  app.toggleExpanded = toggleExpanded;

  app.emitStateChanged = emitStateChanged;

  let notifierController;
  app.notifier = require('./notifier')(async (notifyIds, emit) => {
    const url = new URL(`${app.config.apiServerUrl}/notify`);
    notifyIds.forEach(id => {
      url.searchParams.append('id', id);
    });

    const newNotifierController = new window.AbortController();
    const signal = newNotifierController.signal;

    try {
      const notifierResponse = await window.fetch(url.href, { signal });
      const reader = notifierResponse.body
        .pipeThrough(new window.TextDecoderStream())
        .getReader();

      if (notifierController) {
        notifierController.abort();
      }
      notifierController = newNotifierController;

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        emit(value.trim());
      }
    } catch (error) {
      // The user aborted a request
      if (error.code === 20) {
        return;
      }

      throw error;
    }
  });

  app.listRepositories = require('./repositories/list');
  app.listServices = require('./services/list');
  app.listBranches = require('./services/branches/list');
  app.listDeployments = require('./services/deployments/list');
  app.listInstances = require('./services/deployments/instances/list');
  app.readInstance = require('./services/deployments/instances/read');
  app.readDeployment = require('./services/deployments/read');
  app.patchDeployment = require('./services/deployments/patch');
  app.createDeployment = require('./services/deployments/create');
  app.createInstance = require('./services/deployments/instances/create');
  app.destroyInstance = require('./services/deployments/instances/destroy');
  app.readInstanceBuildLog = require('./services/deployments/instances/buildlog');
  app.readService = require('./services/read');
  app.createService = require('./services/create');

  app.startInstanceLogs = require('./services/deployments/instances/startLogs.js');
  app.stopInstanceLogs = require('./services/deployments/instances/stopLogs.js');

  app.changeUrl = changeUrl;

  app.setLoadingState = setLoadingState;
  app.unsetLoadingState = unsetLoadingState;

  app.on = eventEmitter.addListener.bind(eventEmitter);
  app.off = eventEmitter.removeListener.bind(eventEmitter);

  window.app = app;

  require('./auth/getUser')(app);

  return app;
};
