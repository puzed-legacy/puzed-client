async function stopInstanceLogs (app, serviceId, deploymentId, instanceId) {
  if (!app.state.loggedIn) {
    return;
  }

  app.setLoadingState();

  if (app.state.liveLogs[instanceId] && app.state.liveLogs[instanceId].abort) {
    app.state.liveLogs[instanceId].abort();
    delete app.state.liveLogs[instanceId].abort;
  }

  app.unsetLoadingState();
}

module.exports = stopInstanceLogs;
