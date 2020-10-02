async function login (app, user) {
  app.setLoadingState();

  const sessionCreateResponse = await window.fetch(`${app.config.apiServerUrl}/sessions`, {
    method: 'post',
    body: JSON.stringify({
      email: user.email,
      password: user.password
    })
  });
  const sessionCreateResult = await sessionCreateResponse.json();

  if (sessionCreateResponse.status !== 201) {
    throw Object.assign(new Error('session could not be created'), { data: sessionCreateResult.error });
  }

  window.localStorage.setItem('session', JSON.stringify(sessionCreateResult));
  window.location.href = '/';

  return sessionCreateResult;
}

module.exports = login;
