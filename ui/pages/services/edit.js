const setPath = require('spath/setPath');
const m = require('mithril');
const html = require('hyperx')(m);
const mui = require('mithui');

const menu = require('../../components/menu');

function createForm ({ attrs }) {
  const { app } = attrs;
  const service = attrs.service;

  let errors;

  const getComponent = (field) => {
    if (field.component === 'repositorySelector') {
      return m('strong', service.providerRepositoryId);
    }

    if (field.name === 'secrets') {
      return m('em', 'Secrets can not be edited');
    }

    return {
      component: mui[field.component]
    };
  };

  return {
    oncreate: () => {
      app.listNetworkRules(app);
      app.getSchemaService(app, service.linkId);
    },

    view: () => {
      const fields = ((app.state.schema.service && app.state.schema.service[service.linkId]) || [])
        .map(field => {
          return {
            ...field,
            errors: errors && errors.fields && errors.fields[field.name],
            initialValue: service[field.name],
            ...getComponent(field)
          };
        });

      return m('article',
        m('div', { hidden: !errors }, html`
          <div class="alert alert-danger">
            <div><strong>Could not edit service</strong></div>
            <div>Check and fix any specific errors in the form below then try again.</div>
            ${errors && errors.messages && errors.messages.length > 0 ? html`
              <ul>
                ${errors.messages.map(message => html`<li>${message}</li>`)}
              </ul>
            ` : ''}
          </div>
        `),

        m(mui.form, {
          fields,
          onSubmit: (event, data) => {
            event.preventDefault();

            errors = null;
            app.emitStateChanged();

            const button = event.target.querySelector('form > button');
            button.disabled = true;

            app.updateService(app, service.id, {
              ...data,
              secrets: undefined,
              formId: undefined
            }).then(service => {
              button.disabled = false;
              setPath('/services/' + service.id);
            }).catch(error => {
              console.log(error);
              errors = error.data;
              console.log(errors);
              app.emitStateChanged();
              button.disabled = false;
              document.body.scrollTop = document.documentElement.scrollTop = 0;
              document.querySelector('[autofocus]').focus();
            });
          }
        })
      );
    }
  };
}

function setupService ({ attrs }) {
  return {
    view: ({ attrs }) => {
      const service = attrs.service;
      const link = attrs.app.state.links.find(link => link.id === service.linkId);

      return html`
        <main>
          ${menu(attrs.app, html)}

          <section>
            <div class="heading-container">
              <h1>${service.name} (editing)</h1>
              <div>
                <a class="button" href=${`/services/${service.id}`}>Back</a>
              </div>
            </div>

            <div><strong>Link</strong>: ${link && link.providerId} ${link && link.externalUserId && `(${link.externalUserId})`}</div>
            <hr />        
            ${m(createForm, { app: attrs.app, service })}
          </section>
        </main>
      `;
    }
  };
}

module.exports = function (app, html) {
  return {
    oncreate: () => {
      app.readService(app, app.state.tokens.serviceId);
      app.listDeployments(app, app.state.tokens.serviceId);
      app.listNetworkRules(app);

      app.listLinks(app);
    },

    view: () => {
      const service = app.state.services.find(service => service.id === app.state.tokens.serviceId);

      if (!service) {
        return;
      }

      return m(setupService, { app, service });
    }
  };
};
