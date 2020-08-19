const http = require('stream-http');

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

  let buffer = '';
  let projectDocument;

  return new Promise((resolve, reject) => {
    http.request(options, function (response) {
      response.on('data', (chunk) => {
        buffer = buffer + chunk.toString();

        if (projectDocument) {
          app.state.buildLogs[projectDocument.id] = app.state.buildLogs[projectDocument.id] || '';
          app.state.buildLogs[projectDocument.id] = app.state.buildLogs[projectDocument.id] + chunk.toString();
          app.emitStateChanged();
        }

        if (buffer.includes('\n\n---\n\n')) {
          const splitBuffer = buffer.split('\n\n---\n\n');
          projectDocument = JSON.parse(splitBuffer[0]);
          buffer = buffer[1];

          app.state.projects.push(projectDocument);
          resolve(projectDocument);
          app.unsetLoadingState();
        }
      });
    }).end(JSON.stringify(project));
  });
}

module.exports = createProject;
