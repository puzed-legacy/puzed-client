async function createDomain (app, domain) {
  app.setLoadingState();

  const domainCreationResult = await window.fetch(`${app.config.apiServerUrl}/domains`, {
    method: 'post',
    headers: {
      authorization: 'token ' + app.state.session.secret
    },
    body: JSON.stringify(domain)
  });
  const domainResult = await domainCreationResult.json();

  if (domainCreationResult.status !== 201) {
    throw Object.assign(new Error('domain could not be created'), { data: domainResult.error });
  }

  app.listDomains(app);

  app.unsetLoadingState();

  return domainResult;
}

module.exports = createDomain;
