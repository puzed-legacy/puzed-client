const mithril = require('mithril');
const m = mithril;
const html = require('hyperx')(mithril);

const deploymentItem = require('../components/deploymentItem');
const menu = require('../components/menu');

function branchPicker (vnode) {
  const { app, project } = vnode.attrs;

  app.listBranches(app, project);

  return {
    view: (vnode) => {
      if (!app.state.branches || !app.state.branches[project.id]) {
        return html`
          <select name="${vnode.attrs.name}" disabled="disabled">
            <option>Fetching branches...</option>
          </select>
        `;
      }

      return html`
        <select name="${vnode.attrs.name}">
          ${app.state.branches[project.id].map(branch => m('option', {}, branch.name))}
        </select>
      `;
    }
  };
}

module.exports = function (app, html) {
  app.readProject(app, app.state.tokens.projectId);
  app.listDeployments(app, app.state.tokens.projectId);

  let createDeploymentOpen = false;
  function toggleCreateDeploymentOpen () {
    createDeploymentOpen = !createDeploymentOpen;
    mithril.redraw();
  }

  function handleCreateDeploymentSubmit (event) {
    event.preventDefault();

    const title = event.target.querySelector('[name="title"]').value;
    const branch = event.target.querySelector('[name="branch"]').value;

    app.createDeployment(app, app.state.tokens.projectId, title, branch);

    createDeploymentOpen = false;
    mithril.redraw();
  }

  function renderDeployments (project, deployments) {
    return html`
      <puz-deployments>
        <div class="heading-container">
          <h1>Deployments</h1>>
          <div>
            <button onclick=${toggleCreateDeploymentOpen}>New Deployment</button>
          </div>
        </div>

        ${createDeploymentOpen ? html`
          <puz-deployment>
            <form onsubmit=${handleCreateDeploymentSubmit}>
              <puz-deployment-heading>
                <div class="nowrap cutoff grow">
                  <input name="title" placeholder="Name your new deployment" />
                </div>
                <div class="nowrap cutoff">
                  ${mithril(branchPicker, { name: 'branch', app, project })}
                </div>
                <div>
                  <button>Save</button>
                </div>
              </puz-deployment-heading>
            </form>
          </puz-deployment>
        ` : ''}

        ${deployments.map(deployment => mithril(deploymentItem, { key: deployment.id, app, project, deployment }))}
      </puz-deployments>
    `;
  }

  function renderProject (project, deployments) {
    return html`
      <div class="projectInfo">
        <h1>${project.name}</h2>
        <div>
          <strong>Domain:</strong> <a href="https://${project.domain}" target="_blank">https://${project.domain}</a>
        </div>

        <div>
          <strong>Web Port:</strong> ${project.webPort}
        </div>

        <div>
          <strong>Environment Variables:</strong><br />
          ${!project.environmentVariables
              ? m('div.emptyPlaceholder', 'This project has no environment variables')
              : html`
                <ul class="small">
                  ${(project.environmentVariables || '').split('\n').map(line => {
                    return m('li', line);
                  })}
                </ul> 
              `
          }
        </div>

        <div>
          <strong>Secrets:</strong><br />
            ${
              (project.secrets || []).length === 0
              ? m('div.emptyPlaceholder', 'This project has no secrets')
              : m('ul', { class: 'small' }, (project.secrets || []).map(secret => m('li', secret.name)))
            }
        </div>

        <div>
          <strong>Repository:</strong> <a href="https://github.com/${project.providerRepositoryId}" target="_blank">https://github.com/${project.providerRepositoryId}</a>
        </div>

        ${renderDeployments(project, deployments)}
      </div>
    `;
  }

  return {
    view: () => {
      const project = app.state.projects.find(project => project.id === app.state.tokens.projectId);
      const deployments = app.state.deployments.filter(deployment => deployment.projectId === app.state.tokens.projectId);
      if (!project || !deployments) {
        return;
      }

      return html`
        <main>
          ${menu(app, html)}

          <section>
            ${project ? renderProject(project, deployments) : null}
          </section>
        </main>
      `;
    }
  };
};
