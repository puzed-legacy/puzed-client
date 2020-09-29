const menu = require('../components/menu');

module.exports = function (app, html) {
  app.listServices(app);

  return {
    view: () => html`
      <main>
        ${menu(app, html)}
  
        <section>
          <h2>Your Services</h2>
          <a href="/services/create">Create new service</a>
          <p>Select a service you would like to manage.</p>
          <ul>
            ${(app.state.services || []).map(service => {
              return html`
                <li>
                  <a href="/services/${service.id}">${service.name}</a>
                </li>`;
            })}
          </ul>
        </section>
      </main>
    `
  };
};
