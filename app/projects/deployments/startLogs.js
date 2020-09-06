async function startDeploymentLogs (app, projectId, deploymentId) {
  if (!app.state.loggedIn) {
    return;
  }

  if (app.state.liveLogs[deploymentId] && app.state.liveLogs[deploymentId].connection) {
    app.state.liveLogs[deploymentId].connection.destroy();
  }

  const liveLog = {
    data: 'Connecting to logs...\n\n'
  };
  app.state.liveLogs[deploymentId] = liveLog;

  app.emitStateChanged();

  const response = await window.fetch(`${app.config.apiServerUrl}/projects/${projectId}/deployments/${deploymentId}/log`, {
    headers: {
      authorization: 'token ' + app.state.oauthToken
    }
  });
  const reader = response.body
    .pipeThrough(new window.TextDecoderStream())
    .getReader();

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    liveLog.data = liveLog.data + value.toString();
    app.emitStateChanged();
  }
}

module.exports = startDeploymentLogs;
