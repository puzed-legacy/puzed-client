const EventEmitter = require('events');
const routemeup = require('routemeup');

module.exports = function (config) {
  const eventEmitter = new EventEmitter();

  const state = {
    loading: 0,
    oauthToken: localStorage.getItem('oauthToken'),
    loggedIn: localStorage.getItem('oauthToken')
  };

  async function changeUrl () {
    const route = routemeup(routes, { url: window.location.pathname });

    state.page = route ? await route.controller() : 'notFound';
    state.tokens = route ? route.tokens : {};

    if (state.page) {
      eventEmitter.emit('stateChanged', { force: true });
    }
  }

  const routes = {
    '/': () => 'home',
    '/projects/create': () => 'createProject',
    '/auth': async () => {
      const url = new URL(location.href);
      const accessToken = url.searchParams.get('code');

      const oauthResponse = await fetch(`${config.apiServerUrl}/auth?token=${accessToken}`, {
        method: 'post'
      });

      const oauthData = await oauthResponse.json();

      state.oauthToken = oauthData.access_token;
      localStorage.setItem('oauthToken', oauthData.access_token);

      location.href = '/';
    }
  };

  function emitStateChanged () {
    eventEmitter.emit('stateChanged');
  }

  async function listRepositories () {
    if (!state.loggedIn) {
      return;
    }

    state.loading = state.loading + 1;
    eventEmitter.emit('stateChanged');

    try {
      const response = await fetch('https://api.github.com/user/repos?sort=updated', {
        headers: {
          authorization: 'token ' + state.oauthToken
        }
      });

      const repositories = await response.json();

      state.repositories = repositories;
    } catch (error) {
      console.log(error);
    }

    state.loading = state.loading - 1;
    eventEmitter.emit('stateChanged');
  }

  async function getUser () {
    if (!state.oauthToken) {
      return;
    }

    state.loading = state.loading + 1;
    eventEmitter.emit('stateChanged');

    try {
      const response = await fetch('https://api.github.com/user', {
        headers: {
          authorization: 'token ' + state.oauthToken
        }
      });

      const user = await response.json();

      state.user = user;
    } catch (error) {
      localStorage.removeItem('oauthToken');
      location.reload();
      console.log(error);
    }

    state.loading = state.loading - 1;
    eventEmitter.emit('stateChanged');
  }

  getUser();

  const app = {
    eventEmitter,

    state,
    config,

    emitStateChanged,

    listRepositories,

    changeUrl,

    on: eventEmitter.addListener.bind(eventEmitter),
    off: eventEmitter.removeListener.bind(eventEmitter)
  };

  window.app = app;

  return app;
};
