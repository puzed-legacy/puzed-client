const http = require('stream-http');

async function stopDeploymentLogs (app, projectId, deploymentId) {
  if (!app.state.loggedIn) {
    return;
  }

  app.setLoadingState();

  if (app.state.liveLogs[deploymentId] && app.state.liveLogs[deploymentId].response) {
    app.state.liveLogs[deploymentId].response.destroy()
    delete app.state.liveLogs[deploymentId].response
  }

  app.unsetLoadingState();
}

module.exports = stopDeploymentLogs;
