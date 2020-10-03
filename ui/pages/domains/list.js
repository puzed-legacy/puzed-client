const menu = require('../../components/menu');

module.exports = function (app, html) {
  app.listDomains(app);

  return {
    view: () => html`
      <main>
        ${menu(app, html)}
  
        <section>
          <h2>Domains</h2>
          <p>Create or manage your domains.</p>
          <a href="/domains/create">Create new domain</a>

          <h3>Listing your domains</h3>
          <ul>
            ${(app.state.domains || []).map(domain => {
              return html`
                <li>
                  ${domain.domain}
                </li>`;
            })}
          </ul>
        </section>
      </main>
    `
  };
};
