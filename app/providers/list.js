async function listProviders (app) {
  app.setLoadingState();

  try {
    const response = await window.fetch(`${app.config.apiServerUrl}/providers`, {
      headers: app.state.session ? {
        authorization: 'token ' + app.state.session.secret
      } : {}
    });

    const providers = await response.json();

    app.state.providers = providers;
  } catch (error) {
    console.log(error);
  }

  app.unsetLoadingState();
}

module.exports = listProviders;
