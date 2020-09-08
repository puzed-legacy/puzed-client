async function readProject (app, projectId, deploymentId) {
  if (!app.state.loggedIn) {
    return;
  }

  app.setLoadingState();

  try {
    const response = await window.fetch(`${app.config.apiServerUrl}/projects/${projectId}/deployments/${deploymentId}`, {
      headers: {
        authorization: 'token ' + app.state.oauthToken
      }
    });

    const deployment = await response.json();

    const existingDeploymentIndex = app.state.deployments.findIndex(deployment => deployment.id === deploymentId);
    if (existingDeploymentIndex > -1) {
      app.state.deployments.splice(existingDeploymentIndex, 1);
    }

    app.state.deployments.push(deployment);
  } catch (error) {
    console.log(error);
  }

  app.unsetLoadingState();
}

module.exports = readProject;
