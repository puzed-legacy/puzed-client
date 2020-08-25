const http = require('stream-http');
const NdJsonFe = require('ndjson-fe');

async function createProject (app, project) {
  app.setLoadingState();

  const uri = new URL(`${app.config.apiServerUrl}/projects`);
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

  let projectDocument;

  return new Promise((resolve, reject) => {
    http.request(options, function (response) {
      const stream = new NdJsonFe();
      stream.on('next', entry => {
        if (!projectDocument) {
          projectDocument = entry;
          app.state.projects.push(entry);
          resolve(entry);
          app.unsetLoadingState();
          return;
        }

        app.state.buildLogs[entry[0]] = app.state.buildLogs[entry[0]] || '';
        app.state.buildLogs[entry[0]] = app.state.buildLogs[entry[0]] + entry[1];

        if (!app.state.loading && !app.state.deployments.find(deployment => deployment.id === entry[0])) {
          app.listDeployments(app, projectDocument.id);
        }

        app.emitStateChanged();
      });
      stream.on('error', (error) => {
        console.log('error parsing ndjson', error);
      });

      response.on('data', chunk => {
        stream.emit('write', chunk.toString());
      });

      response.on('end', chunk => {
        app.readProject(app, projectDocument.id);
        app.listDeployments(app, projectDocument.id);
      });
    }).end(JSON.stringify(project));
  });
}

module.exports = createProject;
