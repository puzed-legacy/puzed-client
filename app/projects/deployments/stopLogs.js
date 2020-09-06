async function stopDeploymentLogs (app, projectId, deploymentId) {
  if (!app.state.loggedIn) {
    return;
  }

  app.setLoadingState();

  if (app.state.liveLogs[deploymentId] && app.state.liveLogs[deploymentId].abort) {
    app.state.liveLogs[deploymentId].abort();
    delete app.state.liveLogs[deploymentId].abort;
  }

  app.unsetLoadingState();
}

module.exports = stopDeploymentLogs;
