async function listRepositories (app) {
  if (!app.state.loggedIn) {
    return;
  }

  app.setLoadingState();

  try {
    const response = await window.fetch('https://api.github.com/user/repos?sort=updated', {
      headers: {
        authorization: 'token ' + app.state.oauthToken
      }
    });

    const repositories = await response.json();

    app.state.repositories = repositories;
  } catch (error) {
    console.log(error);
  }

  app.unsetLoadingState();
}

module.exports = listRepositories;
