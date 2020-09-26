async function readInstance (app, projectId, deploymentId, instanceId) {
  if (!app.state.loggedIn) {
    return;
  }

  app.setLoadingState();

  try {
    const response = await window.fetch(`${app.config.apiServerUrl}/projects/${projectId}/deployments/${deploymentId}/instances/${instanceId}`, {
      headers: {
        authorization: 'token ' + app.state.oauthToken
      }
    });

    const instance = await response.json();

    const existingInstanceIndex = app.state.instances.findIndex(instance => instance.id === instanceId);
    if (existingInstanceIndex > -1) {
      app.state.instances.splice(existingInstanceIndex, 1);
    }

    app.state.instances.unshift(instance);
  } catch (error) {
    console.log(error);
  }

  app.unsetLoadingState();
}

module.exports = readInstance;
