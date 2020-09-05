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
        <p>${app.state.user.name}</p>
        <p><a href="${app.state.user.url}">${app.state.user.url}</a></p>
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
