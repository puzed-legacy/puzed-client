async function createService (app, service) {
  app.setLoadingState();

  const secrets = await Promise.all((service.secrets || []).map(secret =>
    new Promise(resolve => {
      const reader = new window.FileReader();
      reader.onload = function (event) {
        resolve({
          ...secret,
          data: event.target.result
        });
      };
      reader.readAsDataURL(secret.file);
    })
  ));

  const serviceCreationResponse = await window.fetch(`${app.config.apiServerUrl}/services`, {
    method: 'post',
    headers: {
      authorization: 'token ' + app.state.session.secret
    },
    body: JSON.stringify({
      ...service,
      secrets
    })
  });
  const serviceResult = await serviceCreationResponse.json();

  app.readService(app, serviceResult.id);
  app.listDeployments(app, serviceResult.id);

  app.unsetLoadingState();

  return serviceResult;
}

module.exports = createService;
