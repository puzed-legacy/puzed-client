async function getUser (app) {
  if (!app.state.session) {
    return;
  }

  try {
    const response = await window.fetch(`${app.config.apiServerUrl}/sessions/current`, {
      headers: {
        authorization: app.state.session.secret
      }
    });

    if (response.status >= 300) {
      window.localStorage.removeItem('session');
      window.location.href = '/';
      return;
    }

    const session = await response.json();

    app.state.user = session.user;
    app.state.session = session;
  } catch (error) {
    console.log(error);
  }

  app.eventEmitter.emit('stateChanged');
}

module.exports = getUser;
