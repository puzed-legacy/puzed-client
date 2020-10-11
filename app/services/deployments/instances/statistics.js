async function readInstanceStatistics (app, serviceId, deploymentId, instanceId) {
  if (!app.state.loggedIn) {
    return;
  }

  app.setLoadingState();

  try {
    const response = await window.fetch(`${app.config.apiServerUrl}/services/${serviceId}/deployments/${deploymentId}/instances/${instanceId}/statistics`, {
      headers: {
        authorization: 'token ' + app.state.session.secret
      }
    });

    const instanceStatistics = await response.json();

    app.state.instanceStatistics[instanceId] = instanceStatistics;
  } catch (error) {
    console.log(error);
  }

  app.unsetLoadingState();
}

module.exports = readInstanceStatistics;
