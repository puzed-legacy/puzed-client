const menu = require('../../components/menu');

module.exports = function (app, html) {
  app.listLinks(app);

  return {
    view: () => html`
      <main>
        ${menu(app, html)}
  
        <section>
          <h2>Links</h2>
          <p>Create or manage your links to source providers.</p>
          <a href="/links/create">Create new link</a>

          <h3>Listing your links</h3>
          <ul>
            ${(app.state.links || []).map(link => {
              return html`
                <li>
                  ${link.providerId} (${link.externalUserId})
                </li>`;
            })}
          </ul>
        </section>
      </main>
    `
  };
};
