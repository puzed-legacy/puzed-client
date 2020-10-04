const m = require('mithril');
const html = require('hyperx')(m);

const menu = require('../../components/menu');

function serviceListByCategory () {
  return {
    view: ({ attrs }) => {
      const { app, category } = attrs;

      const link = app.state.links.find(link => link.id === category);

      return html`
        <div>
          <h3>${link && link.providerId} ${link && link.externalUserId ? `(${link.externalUserId})` : ''}</h3>
          <a href="/services/create?linkId=${category}">Create new service</a>
          <ul>
            ${(app.state.services || [])
            .filter(service => service.linkId === category)
            .map(service => {
              return html`
                <li>
                  <a href="/services/${service.id}">${service.name}</a>
                </li>`;
            })}
          </ul>
        </div>
      `;
    }
  };
}

module.exports = function (app) {
  app.listLinks(app);
  app.listServices(app);

  return {
    view: () => {
      if (!app.state.services || !app.state.links) {
        return;
      }

      const serviceProviders = app.state.services.map(service => service.linkId);
      const links = app.state.links.map(link => link.id);
      const categories = Array.from(new Set(serviceProviders.concat(links)));

      return html`
        <main>
          ${menu(app, html)}
    
          <section>
            <h2>Your Services</h2>
            <p>Select a service you would like to manage.</p>
            ${categories.map(category => m(serviceListByCategory, { app, category }))}
          </section>
        </main>
      `;
    }
  };
};
