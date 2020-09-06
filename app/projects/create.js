async function createProject (app, project) {
  app.setLoadingState();

  const secrets = await Promise.all((project.secrets || []).map(secret =>
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

  const projectCreationResponse = await window.fetch(`${app.config.apiServerUrl}/projects`, {
    method: 'post',
    headers: {
      authorization: 'token ' + app.state.oauthToken
    },
    body: JSON.stringify({
      ...project,
      secrets
    })
  });
  const projectResult = await projectCreationResponse.json();

  app.readProject(app, projectResult.id);
  app.listDeployments(app, projectResult.id);

  app.unsetLoadingState();

  return projectResult;
}

module.exports = createProject;
