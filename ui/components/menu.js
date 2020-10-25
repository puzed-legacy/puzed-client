const md5 = require('md5');

const classcat = require('classcat');

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
        <img src="https://www.libravatar.org/avatar/${emailHash}?d=identicon&s=120" /> ${app.state.user.email}
      </a>
    `;
  }

  function isActiveUrl (url) {
    return window.location.pathname.startsWith(url);
  }

  return html`
    <header>
      <nav>
        <img class="logo" src="/logo.svg" />
        <a href="/">Home</a>
        ${app.state.loggedIn ? html`<a href="/links" class=${classcat({ active: isActiveUrl('/links') })}>Links</a>` : null}
        ${app.state.loggedIn ? html`<a href="/services" class=${classcat({ active: isActiveUrl('/services') })}>Services</a>` : null}
        ${app.state.loggedIn ? html`<a href="/domains" class=${classcat({ active: isActiveUrl('/domains') })}>Domains</a>` : null}
      </nav>
      <nav>
        ${app.state.user ? userPill() : guestPill()}
      </nav>
    </header>
  `;
};
