async function listDomains (app) {
  if (!app.state.loggedIn) {
    return;
  }

  app.setLoadingState();

  try {
    const response = await window.fetch(`${app.config.apiServerUrl}/domains`, {
      headers: {
        authorization: 'token ' + app.state.session.secret
      }
    });

    const domains = await response.json();

    app.state.domains = domains;
  } catch (error) {
    console.log(error);
  }

  app.unsetLoadingState();
}

module.exports = listDomains;
