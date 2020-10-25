async function updateService (app, serviceId, data) {
  app.setLoadingState();

  const serviceUpdateResponse = await window.fetch(`${app.config.apiServerUrl}/services/${serviceId}`, {
    method: 'PATCH',
    headers: {
      authorization: 'token ' + app.state.session.secret
    },
    body: JSON.stringify({
      ...data
    })
  });
  const serviceResult = await serviceUpdateResponse.json();

  if (serviceUpdateResponse.status !== 200) {
    throw Object.assign(new Error('service could not be updated'), { data: serviceResult.error });
  }

  app.readService(app, serviceResult.id);
  app.listDeployments(app, serviceResult.id);

  app.unsetLoadingState();

  return serviceResult;
}

module.exports = updateService;
