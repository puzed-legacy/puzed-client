const http = require('stream-http');
const NdJsonFe = require('ndjson-fe');

async function createDeployment (app, projectId, deploymentId) {
  if (!app.state.loggedIn) {
    return;
  }

  app.setLoadingState();

  const uri = new URL(`${app.config.apiServerUrl}/projects/${projectId}/deployments`);
  const options = {
    method: 'post',
    headers: {
      authorization: 'token ' + app.state.oauthToken
    },
    hostname: uri.hostname,
    port: uri.port,
    path: `${uri.pathname}${uri.search}`,
    protocol: uri.protocol
  };

  return new Promise((resolve, reject) => {
    http.request(options, function (response) {
      resolve();
      app.unsetLoadingState();
      const feed = new NdJsonFe();
      feed.on('next', entry => {
        app.state.buildLogs[entry[0]] = app.state.buildLogs[entry[0]] || '';
        app.state.buildLogs[entry[0]] = app.state.buildLogs[entry[0]] + entry[1];

        if (!app.state.loading && !app.state.deployments.find(deployment => deployment.id === entry[0])) {
          app.listDeployments(app, projectId);
        }

        app.emitStateChanged();
      });
      feed.on('error', (error) => {
        console.log('error parsing ndjson', error);
      });

      response.pipe(feed);

      response.on('end', chunk => {
        app.readProject(app, projectId);
        app.listDeployments(app, projectId);
      });
    }).end();
  });
}

module.exports = createDeployment;
