const setPath = require('spath/setPath');
const m = require('mithril');
const html = require('hyperx')(m);
const mui = require('mithui');

const menu = require('../../components/menu');

function createForm ({ attrs }) {
  const { app, providerRepositoryId, linkId } = attrs;
  let errors;

  const getComponent = (type) => {
    if (type === 'repositorySelector') {
      const repositorySelector = app.state.repositories
        ? mui.select
        : () => {
            return {
              view: () => {
                return html`<em>Loading repositories...</em>`;
              }
            };
          };

      return {
        component: repositorySelector,
        initialValue: providerRepositoryId,
        options: app.state.repositories
          ? app.state.repositories.map(repo => {
              return {
                value: repo.full_name,
                label: `${repo.name} (${repo.full_name})`
              };
            })
          : []
      };
    }

    return {
      component: mui[type]
    };
  };

  return {
    oncreate: () => {
      app.listNetworkRules(app);
      app.getSchemaService(app, linkId);
    },

    view: () => {
      const fields = ((app.state.schema.service && app.state.schema.service[linkId]) || [])
        .map(field => {
          return {
            ...field,
            errors: errors && errors.fields && errors.fields[field.name],
            ...getComponent(field.component)
          };
        });

      return m('article',
        m('div', { hidden: !errors }, html`
          <div class="alert alert-danger">
            <div><strong>Could not create service</strong></div>
            <div>Check and fix any specific errors in the form below then try again.</div>
            ${errors && errors.messages && errors.messages.length > 0
              ? html`
                <ul>
                  ${errors.messages.map(message => html`<li>${message}</li>`)}
                </ul>
              `
              : ''}
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

            app.createService(app, {
              ...data,
              formId: undefined,
              linkId
            }).then(service => {
              console.log('created', service);
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
  const { app, url } = attrs;

  const providerRepositoryId = url.searchParams.get('providerRepositoryId');
  const linkId = url.searchParams.get('linkId');

  return {
    view: ({ attrs }) => {
      const link = attrs.app.state.links.find(link => link.id === linkId);

      return html`
        <main>
          ${m(menu, { app })}

          <section>
            <h1>Create a new service</h1>
            <div><strong>Link</strong>: ${link && link.providerId} ${link && link.externalUserId && `(${link.externalUserId})`}</div>
            <hr />        
            ${m(createForm, { app: attrs.app, providerRepositoryId, linkId })}
          </section>
        </main>
      `;
    }
  };
}

module.exports = function (app) {
  return {
    oncreate: () => {
      const url = new URL(window.location.href);
      app.listRepositories(app, url.searchParams.get('linkId'));
      app.listLinks(app);
    },

    view: () => {
      const url = new URL(window.location.href);

      return m(setupService, { app, url });
    }
  };
};
