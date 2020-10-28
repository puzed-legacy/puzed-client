async function destroyInstance (app, serviceId, deploymentId, instanceId, hard) {
  if (!app.state.loggedIn) {
    return;
  }

  app.setLoadingState();

  try {
    hard = hard ? '?hard=true' : '';
    const response = await window.fetch(`${app.config.apiServerUrl}/services/${serviceId}/deployments/${deploymentId}/instances/${instanceId}${hard}`, {
      method: 'delete',
      headers: {
        authorization: 'token ' + app.state.session.secret
      }
    });

    if (response.status !== 200) {
      throw new Error('could not delete instance, server responded with ' + response.status);
    }

    app.readService(app, serviceId);
    app.listDeployments(app, serviceId);
    app.listInstances(app, serviceId, deploymentId);
  } catch (error) {
    console.log(error);
  }

  app.unsetLoadingState();
}

module.exports = destroyInstance;
