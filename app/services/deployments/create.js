async function createDeployment (app, serviceId, title, branch) {
  if (!app.state.loggedIn) {
    return;
  }

  const index = app.state.deployments.push({
    id: 'tmp' + Date.now(),
    serviceId,
    title,
    branch,
    submitting: true
  });
  app.emitStateChanged();

  const deploymentResponse = await window.fetch(`${app.config.apiServerUrl}/services/${serviceId}/deployments`, {
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

  app.readService(app, serviceId);
  app.state.deployments[index - 1] = deployment;

  app.emitStateChanged();

  return deployment;
}

module.exports = createDeployment;
