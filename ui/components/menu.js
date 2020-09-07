module.exports = function (app, html) {
  function userPill () {
    return html`
      <a target="_blank" href="${app.state.user.html_url}">
        <img src="${app.state.user.avatar_url}" /> ${app.state.user.login}
      </a>
    `;
  }
  return html`
    <header>
      <nav>
        <a href="/">Home</a>
        ${app.state.loggedIn ? html`<a href="/projects">Projects</a>` : null}
      </nav>
      <nav>
        ${app.state.user ? userPill() : null}
      </nav>
    </header>
  `;
};
