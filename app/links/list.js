async function listLinks (app) {
  if (!app.state.loggedIn) {
    return;
  }

  app.setLoadingState();

  try {
    const response = await window.fetch(`${app.config.apiServerUrl}/links`, {
      headers: {
        authorization: 'token ' + app.state.session.secret
      }
    });

    const links = await response.json();

    app.state.links = links;
  } catch (error) {
    console.log(error);
  }

  app.unsetLoadingState();
}

module.exports = listLinks;
