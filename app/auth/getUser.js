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
      throw new Error('session could not be validated');
    }

    const session = await response.json();

    app.state.user = session.user;
    app.state.session = session;
  } catch (error) {
    window.localStorage.removeItem('session');
    window.location.reload();
    console.log(error);
  }

  app.eventEmitter.emit('stateChanged');
}

module.exports = getUser;
