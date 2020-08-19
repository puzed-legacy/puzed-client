async function listProjects (app) {
  if (!app.state.loggedIn) {
    return;
  }

  app.setLoadingState();

  try {
    const response = await window.fetch(`${app.config.apiServerUrl}/projects`, {
      headers: {
        authorization: 'token ' + app.state.oauthToken
      }
    });

    const projects = await response.json();

    app.state.projects = projects;
  } catch (error) {
    console.log(error);
  }

  app.unsetLoadingState();
}

module.exports = listProjects;
