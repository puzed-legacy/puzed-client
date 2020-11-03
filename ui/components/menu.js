const md5 = require('md5');
const classcat = require('classcat');
const m = require('mithril');
const html = require('hyperx')(m);

const homeImage = require('../images/home.js');
const linkImage = require('../images/link.js');
const serviceImage = require('../images/service.js');
const domainImage = require('../images/domain.js');

module.exports = function (vnode) {
  const { app } = vnode.attrs;

  function guestPill () {
    return [html`
      <a target="_blank" href="/login">Login</a>
    `, html`
      <a target="_blank" href="/register">Join</a>
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

  function hideMenu () {
    document.body.classList.remove('burger-open');
  }

  function userLinks () {
    return html`
      <div class="nav-links">  
        <a href="/" onclick=${hideMenu} class=${window.location.pathname === '/' ? 'active' : ''}>
          ${m(homeImage)}
          Home
        </a>
        <a href="/links" onclick=${hideMenu} class=${classcat({ active: isActiveUrl('/links') })}>
          ${m(linkImage)}
          Links
        </a>
        <a href="/services" onclick=${hideMenu} class=${classcat({ active: isActiveUrl('/services') })}>
          ${m(serviceImage)}
          Services
        </a>
        <a href="/domains" onclick=${hideMenu} class=${classcat({ active: isActiveUrl('/domains') })}>
          ${m(domainImage)}
          Domains
        </a>
      </div>
    `;
  }

  function toggleBurgerMenu () {
    document.body.classList.toggle('burger-open');
  }

  function closeBurgerMenu (event) {
    if (event.target.closest('.menu-header')) {
      return;
    }
    document.body.classList.remove('burger-open');
  }

  return {
    oncreate: () => {
      document.addEventListener('click', closeBurgerMenu);
    },

    onremove: () => {
      document.removeEventListener('click', closeBurgerMenu);
    },

    view: () => {
      return html`
      <header class="menu-header">
        <div class="header-top">
          <div class="header-brand">
            <a href="/"><img class="logo" src="/logo.svg" />
              <span>Puzed</span>
            </a>
          </div>
          <div class="header-burger" onclick=${toggleBurgerMenu}>☰</div>
        </div>
        ${app.state.user ? userLinks() : guestLinks()}
        <div class="header-bottom">
          <div class="nav-user">
            ${app.state.user ? userPill() : guestPill()}
          </div>
        </div>
      </header>
    `;
    }
  };
};
