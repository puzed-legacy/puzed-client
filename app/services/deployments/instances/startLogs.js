async function startInstanceLogs (app, serviceId, deploymentId, instanceId) {
  if (!app.state.loggedIn) {
    return;
  }

  if (app.state.liveLogs[instanceId] && app.state.liveLogs[instanceId].abort) {
    app.state.liveLogs[instanceId].abort();
  }

  const liveLog = {
    data: 'Connecting to logs...\n\n'
  };
  app.state.liveLogs[instanceId] = liveLog;

  app.emitStateChanged();

  const controller = new window.AbortController();
  liveLog.abort = () => controller.abort();
  const signal = controller.signal;
  try {
    const response = await window.fetch(`${app.config.apiServerUrl}/services/${serviceId}/deployments/${deploymentId}/instances/${instanceId}/log`, {
      signal,
      headers: {
        authorization: 'token ' + app.state.session.secret
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
  } catch (error) {
    delete liveLog.abort;
    app.emitStateChanged();
  }
}

module.exports = startInstanceLogs;
