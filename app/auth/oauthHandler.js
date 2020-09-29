async function oauthHandler (app) {
  const url = new URL(window.location.href);
  const accessToken = url.searchParams.get('code');
  const installationId = url.searchParams.get('installation_id');

  const providerId = window.location.pathname.split('/')[2];

  const oauthResponse = await window.fetch(`${app.config.apiServerUrl}/providers/${providerId}/oauth?token=${accessToken}&installationId=${installationId}`, {
    method: 'post',
    headers: app.state.session ? {
      authorization: app.state.session.secret
    } : {}
  });

  const oauthData = await oauthResponse.json();

  if (oauthData.actionTaken === 'sessionCreated') {
    window.localStorage.setItem('session', JSON.stringify(oauthData.session));
    window.location.href = '/';
  }

  if (oauthData.actionTaken === 'linkCreated') {
    window.location.href = '/links';
  }
}

module.exports = oauthHandler;
