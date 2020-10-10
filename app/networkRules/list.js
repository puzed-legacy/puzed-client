async function listNetworkRules (app) {
  if (!app.state.loggedIn) {
    return;
  }

  app.setLoadingState();

  try {
    const response = await window.fetch(`${app.config.apiServerUrl}/networkRules`, {
      headers: {
        authorization: 'token ' + app.state.session.secret
      }
    });

    const networkRules = await response.json();

    app.state.networkRules = networkRules;
  } catch (error) {
    console.log(error);
  }

  app.unsetLoadingState();
}

module.exports = listNetworkRules;
