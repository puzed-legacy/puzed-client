const menu = require('../components/menu');

module.exports = function (app, html) {
  function authBox () {
    return html`
      <div>
        <h1>Login</h1>
        <a href="https://github.com/login/oauth/authorize?scope=repo&client_id=${app.config.oauthClientId}">Login via GitHub</a>
      </div>
    `;
  }

  function userBox () {
    if (!app.state.user) {
      return;
    }

    return html`
      <div>
        <h1>Your Account</h1>
        <p>You are logged in as <strong>${app.state.user.email}</strong></p>
      </div>
    `;
  }

  return {
    view: () => html`
      <main>
        ${menu(app, html)}
  
        ${app.state.loggedIn ? userBox() : authBox()}
      </main>
    `
  };
};
