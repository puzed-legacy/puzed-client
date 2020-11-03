const m = require('mithril');
const html = require('hyperx')(m);

const menu = require('../components/menu');

module.exports = function (app) {
  function authBox () {
    return html`
      <section>
        <h1>Welcome</h1>
        <div>
          You are not logged in.
        </div>
      </section>
    `;
  }

  function userBox () {
    if (!app.state.user) {
      return;
    }

    return html`
      <section>
        <h1>Your Account</h1>
        <p>You are logged in as <strong>${app.state.user.email}</strong></p>
      </section>
    `;
  }

  return {
    view: () => html`
      <main>
        ${m(menu, { app })}
  
        ${app.state.loggedIn ? userBox() : authBox()}
      </main>
    `
  };
};
