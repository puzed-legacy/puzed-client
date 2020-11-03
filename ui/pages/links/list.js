const m = require('mithril');
const html = require('hyperx')(m);

const menu = require('../../components/menu');

module.exports = function (app) {
  app.listLinks(app);

  return {
    view: () => html`
      <main>
        ${m(menu, { app })}
  
        <section>
          <h1>Links</h1>
          <p>Create or manage your links to source providers.</p>
          <a href="/links/create">Create new link</a>

          <h2>Listing your links</h2>
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
