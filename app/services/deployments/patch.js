async function patchDeployment (app, serviceId, deploymentId, partialRecord) {
  if (!app.state.loggedIn) {
    return;
  }

  const deploymentResponse = await window.fetch(`${app.config.apiServerUrl}/services/${serviceId}/deployments/${deploymentId}`, {
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

  app.readService(app, serviceId);
  app.readDeployment(app, serviceId, deploymentId);

  app.emitStateChanged();
}

module.exports = patchDeployment;
