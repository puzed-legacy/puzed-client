async function readService (app, serviceId) {
  if (!app.state.loggedIn) {
    return;
  }

  app.setLoadingState();

  try {
    const response = await window.fetch(`${app.config.apiServerUrl}/services/${serviceId}`, {
      headers: {
        authorization: 'token ' + app.state.session.secret
      }
    });

    const service = await response.json();

    const existingServiceIndex = app.state.services.findIndex(service => service.id === serviceId);
    if (existingServiceIndex > -1) {
      app.state.services.splice(existingServiceIndex, 1);
    }

    app.state.services.push(service);
  } catch (error) {
    console.log(error);
  }

  app.unsetLoadingState();
}

module.exports = readService;
