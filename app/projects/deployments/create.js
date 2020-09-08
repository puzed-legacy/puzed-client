async function createDeployment (app, projectId, branch) {
  if (!app.state.loggedIn) {
    return;
  }

  app.setLoadingState();

  await window.fetch(`${app.config.apiServerUrl}/projects/${projectId}/deployments`, {
    method: 'post',
    headers: {
      authorization: 'token ' + app.state.oauthToken
    },
    body: JSON.stringify({
      branch,
      group: branch
    }, null, 2)
  });

  app.readProject(app, projectId);
  app.listDeployments(app, projectId);

  app.unsetLoadingState();
}

module.exports = createDeployment;
