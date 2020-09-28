async function destroyInstance (app, projectId, deploymentId, instanceId) {
  if (!app.state.loggedIn) {
    return;
  }

  app.setLoadingState();

  try {
    const response = await window.fetch(`${app.config.apiServerUrl}/projects/${projectId}/deployments/${deploymentId}/instances/${instanceId}`, {
      method: 'delete',
      headers: {
        authorization: 'token ' + app.state.session.secret
      }
    });

    if (response.status !== 200) {
      throw new Error('could not delete instance, server responded with ' + response.status);
    }

    app.readProject(app, projectId);
    app.listDeployments(app, projectId);
  } catch (error) {
    console.log(error);
  }

  app.unsetLoadingState();
}

module.exports = destroyInstance;
