module.exports = function (app, html) {
  return html`
    <header>
      <nav>
        <a href="/">Home</a>
        <a href="/projects/create">Projects</a>
      </nav>
      ${app.state.loading > 0 ? html`<div class="loading">Loading</div>` : null}
    </header>
  `;
};
