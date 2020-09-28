async function createDeployment (app, projectId, title, branch) {
  if (!app.state.loggedIn) {
    return;
  }

  const index = app.state.deployments.push({
    id: 'tmp' + Date.now(),
    projectId,
    title,
    branch,
    submitting: true
  });
  app.emitStateChanged();

  const deploymentResponse = await window.fetch(`${app.config.apiServerUrl}/projects/${projectId}/deployments`, {
    method: 'post',
    headers: {
      authorization: 'token ' + app.state.session.secret
    },
    body: JSON.stringify({
      title,
      branch
    }, null, 2)
  });

  const deployment = await deploymentResponse.json();

  app.readProject(app, projectId);
  app.state.deployments[index - 1] = deployment;

  app.emitStateChanged();
}

module.exports = createDeployment;
