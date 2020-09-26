async function listInstances (app, projectId, deploymentId) {
  if (!app.state.loggedIn) {
    return;
  }

  app.setLoadingState();

  try {
    const response = await window.fetch(`${app.config.apiServerUrl}/projects/${projectId}/deployments/${deploymentId}/instances`, {
      headers: {
        authorization: 'token ' + app.state.oauthToken
      }
    });

    const instances = await response.json();

    app.state.instances = app.state.instances.filter(instance =>
      instance.deploymentId !== deploymentId
    );
    app.state.instances = app.state.instances.concat(instances);
  } catch (error) {
    console.log(error);
  }

  app.unsetLoadingState();
}

module.exports = listInstances;
