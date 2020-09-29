async function createInstance (app, serviceId, deploymentId) {
  if (!app.state.loggedIn) {
    return;
  }

  app.setLoadingState();

  const instanceResponse = await window.fetch(`${app.config.apiServerUrl}/services/${serviceId}/deployments/${deploymentId}/instances`, {
    method: 'post',
    headers: {
      authorization: 'token ' + app.state.session.secret
    }
  });

  const instance = await instanceResponse.json();

  app.readService(app, serviceId);
  app.readDeployment(app, serviceId, deploymentId);
  app.readInstance(app, serviceId, deploymentId, instance.id);

  app.unsetLoadingState();
}

module.exports = createInstance;
