const m = require('mithril');
const html = require('hyperx')(m);
const setPath = require('spath/setPath');

const menu = require('../../components/menu');

function serviceListByCategory () {
  return {
    view: ({ attrs }) => {
      const { app, category } = attrs;

      const link = app.state.links.find(link => link.id === category);
      return html`
        <div>
          <h2>${link && link.providerId} ${link && link.externalUserId ? `(${link.externalUserId})` : ''}</h2>
          <a href="/services/create?linkId=${category}">Create new service</a>
          <ul class="cards">
            ${(app.state.services || [])
            .filter(service => service.linkId === category)
            .map(service => {
              if (!service.deployments) {
                return '';
              }

              const unstableDeploymentsCount = service.deployments.filter(deployment => !deployment.stable).length;

              function serviceChangeHandler () {
                app.readService(app, service.id);
              }

              function preventBubble (event) {
                event.stopPropagation();
              }

              return m({
                oncreate: () => {
                  app.notifier.on(service.id, serviceChangeHandler);
                },
                onremove: () => app.notifier.off(service.id, serviceChangeHandler),
                view: () => html`
                  <li class="clickable" onclick=${setPath.bind(null, `/services/${service.id}`)} />
                    <a href="/services/${service.id}">${service.name}</a>
                    <a target="_blank" onclick=${preventBubble} href="https://${service.domain}/">https://${service.domain}/</a>
                    <div>
                      ${service.deployments.length} Deployments
                    </div>
                    <div>
                      ${unstableDeploymentsCount > 0
                        ? html`<span class="label label-unhealthy">${unstableDeploymentsCount} Unstable</span>`
                        : html`<span class="label label-healthy">Stable</span>`
                      }
                    </div>
                  </li>
                  `
              });
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
            <h1>Your Services</h1>
            <p>Select a service you would like to manage.</p>
            ${categories.map(category => m(serviceListByCategory, { app, category }))}
          </section>
        </main>
      `;
    }
  };
};
