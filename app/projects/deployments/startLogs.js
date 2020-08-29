const http = require('stream-http');

async function startDeploymentLogs (app, projectId, deploymentId) {
  if (!app.state.loggedIn) {
    return;
  }

  if (app.state.liveLogs[deploymentId] && app.state.liveLogs[deploymentId].connection) {
    app.state.liveLogs[deploymentId].connection.destroy()
  }
  
  const liveLog = {
    data: 'Connecting to logs...\n' 
  };
  app.state.liveLogs[deploymentId] = liveLog

  app.emitStateChanged()

  const uri = new URL(`${app.config.apiServerUrl}/projects/${projectId}/deployments/${deploymentId}/log`);
  const options = {
    method: 'get',
    headers: {
      authorization: 'token ' + app.state.oauthToken
    },
    hostname: uri.hostname,
    port: uri.port,
    path: `${uri.pathname}${uri.search}`,
    protocol: uri.protocol
  };

  const request = http.request(options, function (response) {
    liveLog.response = response

    response.on('end', () => {
      delete app.state.liveLogs[deploymentId].response;
    })

    response.on('close', () => {
      delete app.state.liveLogs[deploymentId].response;
    })

    response.on('data', chunk => {
      if (liveLog.data === 'Connecting to logs...\n') {
        liveLog.data = '';
      }
      liveLog.data = liveLog.data + chunk.toString('utf8');
      app.emitStateChanged();
    })
  })

  request.on('error', (error) => {
    console.log(error)
    delete app.state.liveLogs[deploymentId].response;
    app.emitStateChanged();
  })
  
  request.end();
}

module.exports = startDeploymentLogs;
