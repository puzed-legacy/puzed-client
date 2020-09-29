const mithril = require('mithril');
const m = mithril;
const html = require('hyperx')(mithril);

const deploymentItem = require('../components/deploymentItem');
const menu = require('../components/menu');

function branchPicker (vnode) {
  const { app, service } = vnode.attrs;

  app.listBranches(app, service);

  return {
    view: (vnode) => {
      if (!app.state.branches || !app.state.branches[service.id]) {
        return html`
          <select name="${vnode.attrs.name}" disabled="disabled">
            <option>Fetching branches...</option>
          </select>
        `;
      }

      return html`
        <select name="${vnode.attrs.name}">
          ${app.state.branches[service.id].map(branch => m('option', {}, branch.name))}
        </select>
      `;
    }
  };
}

module.exports = function (app, html) {
  app.readService(app, app.state.tokens.serviceId);
  app.listDeployments(app, app.state.tokens.serviceId);

  let createDeploymentOpen = false;
  function toggleCreateDeploymentOpen () {
    createDeploymentOpen = !createDeploymentOpen;
    mithril.redraw();
  }

  function handleCreateDeploymentSubmit (event) {
    event.preventDefault();

    const title = event.target.querySelector('[name="title"]').value;
    const branch = event.target.querySelector('[name="branch"]').value;

    app.createDeployment(app, app.state.tokens.serviceId, title, branch);

    createDeploymentOpen = false;
    mithril.redraw();
  }

  function renderDeployments (service, deployments) {
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
                  ${mithril(branchPicker, { name: 'branch', app, service })}
                </div>
                <div>
                  <button>Save</button>
                </div>
              </puz-deployment-heading>
            </form>
          </puz-deployment>
        ` : ''}

        ${deployments.map(deployment => mithril(deploymentItem, { key: deployment.id, app, service, deployment }))}
      </puz-deployments>
    `;
  }

  function renderService (service, deployments) {
    return html`
      <div class="serviceInfo">
        <h1>${service.name}</h2>
        <div>
          <strong>Domain:</strong> <a href="https://${service.domain}" target="_blank">https://${service.domain}</a>
        </div>

        <div>
          <strong>Web Port:</strong> ${service.webPort}
        </div>

        <div>
          <strong>Environment Variables:</strong><br />
          ${!service.environmentVariables
              ? m('div.emptyPlaceholder', 'This service has no environment variables')
              : html`
                <ul class="small">
                  ${(service.environmentVariables || '').split('\n').map(line => {
                    return m('li', line);
                  })}
                </ul> 
              `
          }
        </div>

        <div>
          <strong>Secrets:</strong><br />
            ${
              (service.secrets || []).length === 0
              ? m('div.emptyPlaceholder', 'This service has no secrets')
              : m('ul', { class: 'small' }, (service.secrets || []).map(secret => m('li', secret.name)))
            }
        </div>

        <div>
          <strong>Repository:</strong> <a href="https://github.com/${service.providerRepositoryId}" target="_blank">https://github.com/${service.providerRepositoryId}</a>
        </div>

        ${renderDeployments(service, deployments)}
      </div>
    `;
  }

  return {
    view: () => {
      const service = app.state.services.find(service => service.id === app.state.tokens.serviceId);
      const deployments = app.state.deployments.filter(deployment => deployment.serviceId === app.state.tokens.serviceId);
      if (!service || !deployments) {
        return;
      }

      return html`
        <main>
          ${menu(app, html)}

          <section>
            ${service ? renderService(service, deployments) : null}
          </section>
        </main>
      `;
    }
  };
};
