async function listBranches (app, project) {
  if (!app.state.loggedIn) {
    return;
  }

  app.setLoadingState();

  try {
    const response = await window.fetch(`${app.config.apiServerUrl}/providers/github/repositories/${project.providerRepositoryId}/branches`, {
      headers: {
        authorization: 'token ' + app.state.session.secret
      }
    });

    const branches = await response.json();
    app.state.branches = app.state.branches || {};

    app.state.branches[project.id] = branches;
  } catch (error) {
    console.log(error);
  }

  app.unsetLoadingState();
}

module.exports = listBranches;
