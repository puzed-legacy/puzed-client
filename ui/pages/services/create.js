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

function createForm (app, providerRepositoryId, linkId) {
  return m(mui.form, {
    fields: [
      {
        name: 'name',
        label: 'Service Name',
        component: mui.textInput,
        autoFocus: true
      },
      {
        name: 'providerRepositoryId',
        label: 'Source Code Repository',
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
        component: mui.multilineInput
      },
      {
        name: 'secrets',
        label: 'Secrets',
        prefix: '/run/secrets/',
        component: mui.filePicker,
        multiple: true
      },
      {
        name: 'buildCommand',
        label: 'Build command',
        component: mui.textInput,
        initialValue: 'npm install'
      },
      {
        name: 'runCommand',
        label: 'Run command',
        component: mui.textInput,
        initialValue: 'npm run start'
      },
      {
        name: 'webPort',
        label: 'Web Port',
        component: mui.textInput,
        initialValue: '8000'
      },
      {
        name: 'domain',
        label: 'Domain',
        component: mui.textInput,
        initialValue: 'example.puzed.com'
      }
    ],
    onSubmit: (event, data) => {
      event.preventDefault();
      const button = event.target.querySelector('form > button');
      button.disabled = true;

      app.createService(app, {
        ...data,
        provider: 'github',
        providerRepositoryId,
        linkId
      }).then(service => {
        button.disabled = false;
        setPath('/services/' + service.id);
      }).catch(error => {
        console.log(error);
        button.disabled = false;
      });
    }
  });
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
            ${createForm(attrs.app, providerRepositoryId, linkId)}
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
