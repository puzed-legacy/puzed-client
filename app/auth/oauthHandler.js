async function oauthHandler (app) {
  const url = new URL(window.location.href);
  const accessToken = url.searchParams.get('code');

  const providerId = window.location.pathname.split('/')[2];

  const oauthResponse = await window.fetch(`${app.config.apiServerUrl}/providers/${providerId}/oauth?token=${accessToken}`, {
    method: 'post'
  });

  const oauthData = await oauthResponse.json();

  window.localStorage.setItem('session', JSON.stringify(oauthData));

  window.location.href = '/';
}

module.exports = oauthHandler;
