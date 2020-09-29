async function readDeployment (app, serviceId, deploymentId) {
  if (!app.state.loggedIn) {
    return;
  }

  try {
    const response = await window.fetch(`${app.config.apiServerUrl}/services/${serviceId}/deployments/${deploymentId}`, {
      headers: {
        authorization: 'token ' + app.state.session.secret
      }
    });

    const deployment = await response.json();

    const existingDeploymentIndex = app.state.deployments.findIndex(deployment => deployment.id === deploymentId);
    if (existingDeploymentIndex > -1) {
      app.state.deployments[existingDeploymentIndex] = deployment;
      app.emitStateChanged();
      return;
    }

    app.state.deployments.push(deployment);
    app.emitStateChanged();
  } catch (error) {
    console.log(error);
  }
}

module.exports = readDeployment;
