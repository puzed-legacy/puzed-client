async function listDeployments (app, serviceId) {
  if (!app.state.loggedIn) {
    return;
  }

  app.setLoadingState();

  try {
    const response = await window.fetch(`${app.config.apiServerUrl}/services/${serviceId}/deployments`, {
      headers: {
        authorization: 'token ' + app.state.session.secret
      }
    });

    const deployments = await response.json();

    app.state.deployments = app.state.deployments.filter(deployment => deployment.serviceId !== serviceId);
    app.state.deployments = app.state.deployments.concat(deployments);
  } catch (error) {
    console.log(error);
  }

  app.unsetLoadingState();
}

module.exports = listDeployments;
