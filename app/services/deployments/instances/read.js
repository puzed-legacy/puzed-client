async function readInstance (app, serviceId, deploymentId, instanceId) {
  if (!app.state.loggedIn) {
    return;
  }

  app.setLoadingState();

  try {
    const response = await window.fetch(`${app.config.apiServerUrl}/services/${serviceId}/deployments/${deploymentId}/instances/${instanceId}`, {
      headers: {
        authorization: 'token ' + app.state.session.secret
      }
    });

    const instance = await response.json();

    const existingInstanceIndex = app.state.instances.findIndex(instance => instance.id === instanceId);
    if (existingInstanceIndex === -1) {
      app.state.instances.unshift(instance);
    } else {
      app.state.instances[existingInstanceIndex] = instance;
    }
  } catch (error) {
    console.log(error);
  }

  app.unsetLoadingState();
}

module.exports = readInstance;
