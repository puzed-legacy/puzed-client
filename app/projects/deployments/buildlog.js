async function buildlog (app, projectId, deploymentId) {
  if (!app.state.loggedIn) {
    return;
  }

  if (app.state.buildLogs[deploymentId]) {
    return;
  }

  app.setLoadingState();

  try {
    const response = await window.fetch(`${app.config.apiServerUrl}/projects/${projectId}/deployments/${deploymentId}/buildlog`, {
      headers: {
        authorization: 'token ' + app.state.oauthToken
      }
    });

    const buildlogData = await response.text();

    app.state.buildLogs[deploymentId] = buildlogData;
    app.emitStateChanged();
  } catch (error) {
    console.log(error);
  }

  app.unsetLoadingState();
}

module.exports = buildlog;
