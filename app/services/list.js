async function listServices (app) {
  if (!app.state.loggedIn) {
    return;
  }

  app.setLoadingState();

  try {
    const response = await window.fetch(`${app.config.apiServerUrl}/services`, {
      headers: {
        authorization: 'token ' + app.state.session.secret
      }
    });

    const services = await response.json();

    app.state.services = services;
  } catch (error) {
    console.log(error);
  }

  app.unsetLoadingState();
}

module.exports = listServices;
