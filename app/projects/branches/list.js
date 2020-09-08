async function listBranches (app, project) {
  if (!app.state.loggedIn) {
    return;
  }

  app.setLoadingState();

  try {
    const response = await window.fetch(`https://api.github.com/repos/${project.owner}/${project.repo}/branches`, {
      headers: {
        authorization: 'token ' + app.state.oauthToken
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
