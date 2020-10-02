async function listRepositories (app, linkId) {
  if (!app.state.loggedIn) {
    return;
  }

  app.setLoadingState();

  try {
    const response = await window.fetch(`${app.config.apiServerUrl}/links/${linkId}/repositories`, {
      headers: {
        authorization: 'token ' + app.state.session.secret
      }
    });

    const repositories = await response.json();

    app.state.repositories = repositories;
  } catch (error) {
    console.log(error);
  }

  app.unsetLoadingState();
}

module.exports = listRepositories;
