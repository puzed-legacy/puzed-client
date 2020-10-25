async function deleteDeployment (app, serviceId, deploymentId) {
  if (!app.state.loggedIn) {
    return;
  }

  app.setLoadingState();

  try {
    const response = await window.fetch(`${app.config.apiServerUrl}/services/${serviceId}/deployments/${deploymentId}`, {
      method: 'delete',
      headers: {
        authorization: 'token ' + app.state.session.secret
      }
    });

    if (response.status !== 200) {
      throw new Error('could not delete deployment, server responded with ' + response.status);
    }

    app.readService(app, serviceId);
    app.listDeployments(app, serviceId);
  } catch (error) {
    console.log(error);
  }

  app.unsetLoadingState();
}

module.exports = deleteDeployment;
