async function destroyDeployment (app, projectId, deploymentId) {
  if (!app.state.loggedIn) {
    return;
  }

  app.setLoadingState();

  try {
    const response = await window.fetch(`${app.config.apiServerUrl}/projects/${projectId}/deployments/${deploymentId}`, {
      method: 'delete',
      headers: {
        authorization: 'token ' + app.state.oauthToken
      }
    });

    if (response.status !== 200) {
      throw new Error('could not delete deployment, server responded with ' + response.status);
    }

    app.readProject(app, projectId);
    app.listDeployments(app, projectId);
  } catch (error) {
    console.log(error);
  }

  app.unsetLoadingState();
}

module.exports = destroyDeployment;
