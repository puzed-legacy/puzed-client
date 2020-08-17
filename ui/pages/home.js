const menu = require('../components/menu');

module.exports = function (app, html) {
  function authBox () {
    return html`
      <div>
        <h1>Login</h1>
        <a href="https://github.com/login/oauth/authorize?scope=repo&client_id=${app.config.oauthClientId}">Login via GitHub</a>
      </div>
    `
  }

  function userBox () {
    if (!app.state.user) {
      return
    }

    return html`
      <div>
        <h1>Your Account</h1>
        <p>${app.state.user.name}</p>
        <p><a href="${app.state.user.url}">${app.state.user.url}</a></p>
      </div>
    `
  }

  function repositories () {
    return html`
      <div>
        <h2>Your Repositories</h2>
        <ul>
          ${(app.state.repositories || []).map(repository => {
            return html`
              <li>
                <a href="${repository.html_url}">${repository.name}</a>
              </li>`
          })}
        </ul>
      </div>
    `
  }

  return html`
    <main>
      ${menu(app, html)}
 
      ${app.state.loggedIn ? userBox() : authBox()}
    </main>
  `;
};
