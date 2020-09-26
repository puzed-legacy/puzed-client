async function buildlog (app, projectId, deploymentId, instanceId) {
  if (!app.state.loggedIn) {
    return;
  }

  if (app.state.buildLogs[instanceId]) {
    return;
  }

  app.setLoadingState();
  app.state.buildLogs[instanceId] = '';

  const response = await window.fetch(`${app.config.apiServerUrl}/projects/${projectId}/deployments/${deploymentId}/instances/${instanceId}/buildlog`, {
    headers: {
      authorization: 'token ' + app.state.oauthToken
    }
  });
  const reader = response.body
    .pipeThrough(new window.TextDecoderStream())
    .getReader();

  app.unsetLoadingState();

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    app.state.buildLogs[instanceId] = app.state.buildLogs[instanceId] + value.toString();
    app.emitStateChanged();
  }
}

module.exports = buildlog;
