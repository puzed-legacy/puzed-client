const setPath = require('spath/setPath');
const m = require('mithril');
const html = require('hyperx')(m);
const mui = require('mithui');

const menu = require('../../components/menu');

function loadingSelect () {
  return {
    view: () => {
      return html`<em>Loading repositories from source provider...</em>`;
    }
  };
}

function createForm ({ attrs }) {
  const { app, providerRepositoryId, linkId } = attrs;
  let errors;

  return {
    view: () => {
      return m('div',
        m('div', { hidden: !errors }, html`
          <div class="alert alert-danger">
            <div><strong>Could not create service</strong></div>
            <div>Check and fix any specific errors in the form below then try again.</div>
            ${errors.messages ? html`
              <ul>
                ${errors.messages.map(message => html`<li>${message}</li>`)}
              </ul>
            ` : ''}
          </div>
        `),

        m(mui.form, {
          fields: [
            {
              name: 'name',
              label: 'Service Name',
              errors: errors && errors.fields && errors.fields.name,
              component: mui.textInput,
              autoFocus: true
            },
            {
              name: 'providerRepositoryId',
              label: 'Source Code Repository',
              errors: errors && errors.fields && errors.fields.providerRepositoryId,
              component: app.state.repositories ? mui.select : loadingSelect,
              options: app.state.repositories ? app.state.repositories.map(repo => {
                return {
                  value: repo.full_name,
                  label: `${repo.name} (${repo.full_name})`
                };
              }) : [],
              initialValue: providerRepositoryId
            },
            {
              name: 'image',
              label: 'Image',
              errors: errors && errors.fields && errors.fields.image,
              component: mui.select,
              options: [
                {
                  value: 'nodejs12',
                  label: 'NodeJS (version 12)'
                }
              ],
              initialValue: 'nodejs12'
            },
            {
              name: 'environmentVariables',
              label: 'Environment Variables',
              errors: errors && errors.fields && errors.fields.environmentVariables,
              component: mui.multilineInput
            },
            {
              name: 'secrets',
              label: 'Secrets',
              errors: errors && errors.fields && errors.fields.secrets,
              prefix: '/run/secrets/',
              component: mui.filePicker,
              multiple: true
            },
            {
              name: 'buildCommand',
              label: 'Build command',
              errors: errors && errors.fields && errors.fields.buildCommand,
              component: mui.textInput,
              initialValue: 'npm install'
            },
            {
              name: 'runCommand',
              label: 'Run command',
              errors: errors && errors.fields && errors.fields.runCommand,
              component: mui.textInput,
              initialValue: 'npm run start'
            },
            {
              name: 'webPort',
              label: 'Web Port',
              errors: errors && errors.fields && errors.fields.webPort,
              component: mui.textInput,
              initialValue: '8000'
            },
            {
              name: 'domain',
              label: 'Domain',
              errors: errors && errors.fields && errors.fields.domain,
              component: mui.textInput,
              initialValue: 'example.puzed.com'
            }
          ],
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
  const url = attrs.url;

  const providerRepositoryId = url.searchParams.get('providerRepositoryId');
  const linkId = url.searchParams.get('linkId');

  return {
    view: ({ attrs }) => {
      const link = attrs.app.state.links.find(link => link.id === linkId);

      return html`
        <main>
          ${menu(attrs.app, html)}

          <section>
            <h2>Create a new service</h2>
            <div><strong>Link</strong>: ${link && link.providerId} ${link && link.externalUserId && `(${link.externalUserId})`}</div>
            <hr />        
            ${m(createForm, { app: attrs.app, providerRepositoryId, linkId })}
          </section>
        </main>
      `;
    }
  };
}

module.exports = function (app, html) {
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
