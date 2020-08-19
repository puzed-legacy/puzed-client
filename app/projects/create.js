async function createProject (app) {
  return window.fetch(`${app.config.apiServerUrl}/projects`, {
    method: 'post',
    body: JSON.stringify({
      image: 'node:12',
      domain: 'minthril-demo.puzed.net',
      name: 'markwylde/minthril-demo',
      owner: 'markwylde',
      repo: 'minthril-demo',
      webport: 8000
    }),
    headers: {
      authorization: 'token ' + app.state.oauthToken
    }
  });
}

module.exports = createProject;
