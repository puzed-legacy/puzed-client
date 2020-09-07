async function createDeployment (app, projectId) {
  if (!app.state.loggedIn) {
    return;
  }

  app.setLoadingState();

  await window.fetch(`${app.config.apiServerUrl}/projects/${projectId}/deployments`, {
    method: 'post',
    headers: {
      authorization: 'token ' + app.state.oauthToken
    }
  });

  app.readProject(app, projectId);
  app.listDeployments(app, projectId);

  app.unsetLoadingState();
}

module.exports = createDeployment;
