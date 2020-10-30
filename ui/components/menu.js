const md5 = require('md5');

const classcat = require('classcat');
const m = require('mithril');

const homeImage = require('../images/home.js');
const linkImage = require('../images/link.js');
const serviceImage = require('../images/service.js');
const domainImage = require('../images/domain.js');

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
        <img src="https://www.libravatar.org/avatar/${emailHash}?d=identicon&s=120" />
      </a>
    `;
  }

  function isActiveUrl (url) {
    return window.location.pathname.startsWith(url);
  }

  function guestLinks () {
    return html`
      <div class="nav-links">  
        <a href="/">Home</a>
      </div>
    `;
  }

  function userLinks () {
    return html`
      <div class="nav-links">  
        <a href="/" class=${window.location.pathname === '/' ? 'active' : ''}>
          ${m(homeImage)}
          Home
        </a>
        <a href="/links" class=${classcat({ active: isActiveUrl('/links') })}>
          ${m(linkImage)}
          Links
        </a>
        <a href="/services" class=${classcat({ active: isActiveUrl('/services') })}>
          ${m(serviceImage)}
          Services
        </a>
        <a href="/domains" class=${classcat({ active: isActiveUrl('/domains') })}>
          ${m(domainImage)}
          Domains
        </a>
      </div>
    `;
  }

  function toggleBurger () {
    document.body.classList.toggle('burger-open');
  }

  return html`
    <header>
      <div class="header-top">
        <div class="header-brand">
          <img class="logo" src="/logo.svg" />
          <span>Puzed Official</span>
        </div>
        <div class="header-burger" onclick=${toggleBurger}>☰</div>
      </div>
      ${app.state.user ? userLinks() : guestLinks()}
      <div class="header-bottom">
        <div class="nav-user">
          ${app.state.user ? userPill() : guestPill()}
        </div>
      </div>
    </header>
  `;
};
