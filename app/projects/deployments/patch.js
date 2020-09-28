async function patchDeployment (app, projectId, deploymentId, partialRecord) {
  if (!app.state.loggedIn) {
    return;
  }

  const deploymentResponse = await window.fetch(`${app.config.apiServerUrl}/projects/${projectId}/deployments/${deploymentId}`, {
    method: 'PATCH',
    headers: {
      authorization: 'token ' + app.state.session.secret
    },
    body: JSON.stringify(partialRecord, null, 2)
  });

  const deployment = await deploymentResponse.json();

  const existingDeploymentIndex = app.state.deployments.findIndex(deployment => deployment.id === deploymentId);
  if (existingDeploymentIndex > -1) {
    app.state.deployments[existingDeploymentIndex] = deployment;
    app.emitStateChanged();
    return;
  }

  app.readProject(app, projectId);
  app.readDeployment(app, projectId, deploymentId);

  app.emitStateChanged();
}

module.exports = patchDeployment;
