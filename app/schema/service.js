async function readServiceSchema (app, linkId) {
  if (!app.state.loggedIn) {
    return;
  }

  app.setLoadingState();

  try {
    const response = await window.fetch(`${app.config.apiServerUrl}/schema/service?linkId=${linkId}`, {
      headers: {
        authorization: 'token ' + app.state.session.secret
      }
    });

    const schema = await response.json();

    app.state.schema.service = app.state.schema.service || {};
    app.state.schema.service[linkId] = schema;
  } catch (error) {
    console.log(error);
  }

  app.unsetLoadingState();
}

module.exports = readServiceSchema;
