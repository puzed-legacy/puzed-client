async function getUser (app) {
  if (!app.state.oauthToken) {
    return;
  }

  app.state.loading = app.state.loading + 1;
  app.eventEmitter.emit('stateChanged');

  try {
    const response = await window.fetch('https://api.github.com/user', {
      headers: {
        authorization: 'token ' + app.state.oauthToken
      }
    });

    if (response.status >= 300) {
      throw new Error('session could not be validated');
    }

    const user = await response.json();

    app.state.user = user;
  } catch (error) {
    window.localStorage.removeItem('oauthToken');
    window.location.reload();
    console.log(error);
  }

  app.state.loading = app.state.loading - 1;
  app.eventEmitter.emit('stateChanged');
}

module.exports = getUser;
