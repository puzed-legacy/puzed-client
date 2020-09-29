const md5 = require('md5');

module.exports = function (app, html) {
  function guestPill () {
    return [html`
      <a target="_blank" href="/login">Login</a>
    `, html`
      <a target="_blank" href="/register">Register</a>
    `];
  }

  function userPill () {
    const emailHash = md5(app.state.user.email);

    return html`
      <a target="_blank" href="#">
        <img src="https://www.gravatar.com/avatar/${emailHash}?s=50" /> ${app.state.user.email}
      </a>
    `;
  }

  return html`
    <header>
      <nav>
        <a href="/">Home</a>
        ${app.state.loggedIn ? html`<a href="/services">Services</a>` : null}
      </nav>
      <nav>
        ${app.state.user ? userPill() : guestPill()}
      </nav>
    </header>
  `;
};
