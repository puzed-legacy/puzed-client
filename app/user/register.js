async function register (app, user) {
  app.setLoadingState();

  if (user.password !== user.passwordConfirmation) {
    throw Object.assign(new Error('user could not be created'), {
      data: {
        fields: {
          passwordConfirmation: ['must match password']
        }
      }
    });
  }

  const userRegistrationResponse = await window.fetch(`${app.config.apiServerUrl}/users`, {
    method: 'post',
    body: JSON.stringify({
      email: user.email,
      password: user.password
    })
  });
  const userRegistrationResult = await userRegistrationResponse.json();

  if (userRegistrationResponse.status !== 201) {
    throw Object.assign(new Error('user could not be created'), { data: userRegistrationResult.error });
  }

  app.unsetLoadingState();

  return userRegistrationResult;
}

module.exports = register;
