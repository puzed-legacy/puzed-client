module.exports = function (app, html) {
  return html`
    <header>
      <nav>
        <a href="/">Home</a>
        ${app.state.loggedIn ? html`<a href="/projects">Projects</a>` : null}
      </nav>
    </header>
  `;
};
