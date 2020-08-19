async function authLoginHandler (app) {
  const url = new URL(window.location.href);
  const accessToken = url.searchParams.get('code');

  const oauthResponse = await window.fetch(`${app.config.apiServerUrl}/auth?token=${accessToken}`, {
    method: 'post'
  });

  const oauthData = await oauthResponse.json();

  app.state.oauthToken = oauthData.access_token;
  window.localStorage.setItem('oauthToken', oauthData.access_token);

  window.location.href = '/';
}

module.exports = authLoginHandler;
