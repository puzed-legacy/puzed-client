async function createInstance (app, projectId, deploymentId) {
  if (!app.state.loggedIn) {
    return;
  }

  app.setLoadingState();

  const instanceResponse = await window.fetch(`${app.config.apiServerUrl}/projects/${projectId}/deployments/${deploymentId}/instances`, {
    method: 'post',
    headers: {
      authorization: 'token ' + app.state.oauthToken
    }
  });

  const instance = await instanceResponse.json();

  app.readProject(app, projectId);
  app.readDeployment(app, projectId, deploymentId);
  app.readInstance(app, projectId, deploymentId, instance.id);

  app.unsetLoadingState();
}

module.exports = createInstance;
