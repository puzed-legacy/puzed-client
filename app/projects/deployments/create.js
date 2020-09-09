async function createDeployment (app, projectId, branch) {
  if (!app.state.loggedIn) {
    return;
  }

  app.setLoadingState();

  const deploymentResponse = await window.fetch(`${app.config.apiServerUrl}/projects/${projectId}/deployments`, {
    method: 'post',
    headers: {
      authorization: 'token ' + app.state.oauthToken
    },
    body: JSON.stringify({
      branch,
      group: branch
    }, null, 2)
  });

  const deployment = await deploymentResponse.json();

  app.readProject(app, projectId);
  app.readDeployment(app, projectId, deployment.id);

  app.unsetLoadingState();
}

module.exports = createDeployment;
