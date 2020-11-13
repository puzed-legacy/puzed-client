async function buildlog (app, serviceId, deploymentId) {
  if (!app.state.loggedIn) {
    return;
  }

  if (app.state.buildLogs[deploymentId]) {
    return;
  }

  app.setLoadingState();
  app.state.buildLogs[deploymentId] = '';

  const response = await window.fetch(`${app.config.apiServerUrl}/services/${serviceId}/deployments/${deploymentId}/buildlog`, {
    headers: {
      authorization: 'token ' + app.state.session.secret
    }
  });
  const reader = response.body
    .pipeThrough(new window.TextDecoderStream())
    .getReader();

  app.unsetLoadingState();

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    app.state.buildLogs[deploymentId] = app.state.buildLogs[deploymentId] + value.toString();
    app.emitStateChanged();
  }
}

module.exports = buildlog;
