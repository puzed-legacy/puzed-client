const setPath = require('spath/setPath');
const m = require('mithril');
const html = require('hyperx')(m);
const mui = require('mithui');

const menu = require('../components/menu');

function createForm (app, providerRepositoryId) {
  return m(mui.form, {
    fields: [
      {
        name: 'name',
        label: 'Project Name',
        component: mui.textInput,
        autoFocus: true,
        initialValue: `my-${providerRepositoryId.replace(/\//g, '-')}-1`
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
        initialValue: 'npm ci'
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
        initialValue: `${providerRepositoryId}.puzed.com`
      }
    ],
    onSubmit: (event, data) => {
      event.preventDefault();
      const button = event.target.querySelector('form > button');
      button.disabled = true;

      app.createProject(app, {
        ...data,
        provider: 'github',
        providerRepositoryId
      }).then(project => {
        button.disabled = false;
        setPath('/projects/' + project.id);
      }).catch(error => {
        console.log(error);
        button.disabled = false;
      });
    }
  });
}

function selectRepository ({ attrs }) {
  return {
    oncreate: () => {
      attrs.app.listRepositories(attrs.app);
    },

    view: () => {
      const app = attrs.app;

      return html`
        <main>
          ${menu(app, html)}
    
          <section>
            <h2>Your Repositories</h2>
            <p>Select a repository you would like to deploy.</p>
            <ul>
              ${(app.state.repositories || []).map(repository => {
                return html`
                  <li>
                    <a href="/projects/create?providerRepositoryId=${repository.full_name}">${repository.name}</a>
                  </li>`;
              })}
            </ul>
          </section>
        </main>
      `;
    }
  };
}

function setupProject ({ attrs }) {
  const url = attrs.url;

  const providerRepositoryId = url.searchParams.get('providerRepositoryId');

  return {
    view: ({ attrs }) => {
      return html`
        <main>
          ${menu(attrs.app, html)}

          <section>
            <h2>Create a new project</h2>
            <strong>Provider</strong>: github
            <strong>Repository</strong>: ${providerRepositoryId}
            <hr />        
            ${createForm(attrs.app, providerRepositoryId)}
          </section>
        </main>
      `;
    }
  };
}

module.exports = function (app, html) {
  return {
    view: () => {
      const url = new URL(window.location.href);

      if (url.searchParams.get('providerRepositoryId')) {
        return m(setupProject, { app, url });
      }

      return m(selectRepository, { app, url });
    }
  };
};
