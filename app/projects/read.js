async function readProject (app, projectId) {
  if (!app.state.loggedIn) {
    return;
  }

  app.setLoadingState();

  try {
    const response = await window.fetch(`${app.config.apiServerUrl}/projects/${projectId}`, {
      headers: {
        authorization: 'token ' + app.state.oauthToken
      }
    });

    const project = await response.json();

    const existingProjectIndex = app.state.projects.findIndex(project => project.id === projectId);
    if (existingProjectIndex > -1) {
      app.state.projects.splice(existingProjectIndex, 1);
    }

    app.state.projects.push(project);
  } catch (error) {
    console.log(error);
  }

  app.unsetLoadingState();
}

module.exports = readProject;
