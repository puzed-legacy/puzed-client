const format = require('date-fns/format');
const mithril = require('mithril');
const m = mithril;
const html = require('hyperx')(mithril);

const menu = require('../components/menu');
const terminal = require('../components/terminal');
const tabbed = require('../components/tabbed');

function settings (app, project, deployment) {
  function destroyDeployment (project, deployment) {
    app.destroyDeployment(app, project.id, deployment.id);
  }

  return {
    view: () => html`
      <puz-build-log>
        <div>
          <label>Commit Hash:</label> ${deployment.commitHash}
        </div>
        <button onclick=${destroyDeployment.bind(null, project, deployment)}>Destroy</button>
      </puz-build-log>
    `
  };
}

function liveLog (app, project, deployment) {
  const reconnect = event => {
    event.preventDefault();
    app.startDeploymentLogs(app, project.id, deployment.id);
  };

  return {
    oncreate: () => {
      app.startDeploymentLogs(app, project.id, deployment.id);
    },

    ondelete: () => {
      app.stopDeploymentLogs(app, project.id, deployment.id);
    },

    view: () => {
      return html`
        <puz-live-log>
        ${app.state.liveLogs[deployment.id] && !app.state.liveLogs[deployment.id].response && deployment.status !== 'destroyed' ? html`
            <div class="alert alert-warning">
              Logs are not live. Disconnected.
              <a href="javascript:void(0)" onclick=${reconnect}>Click here to reconnect</a>
            </div>
          ` : ''}

          ${deployment.status === 'destroyed' ? html`
            <div class="alert alert-info">
              Logs are not live. Container is destroyed.
            </div>
          ` : ''}
          ${mithril(terminal, { content: (app.state.liveLogs[deployment.id] && app.state.liveLogs[deployment.id].data) || 'No logs found' })}
        </puz-live-log>
      `;
    }
  };
}

function deploymentLog (app, project, deployment) {
  return {
    oncreate: () => {
      app.readDeploymentBuildLog(app, project.id, deployment.id);
    },

    view: () => {
      return html`
        <puz-build-log>
          ${mithril(terminal, { content: app.state.buildLogs[deployment.id] || deployment.buildLog || 'No build log found' })}
        </puz-build-log>
      `;
    }
  };
}

module.exports = function (app, html) {
  app.readProject(app, app.state.tokens.projectId);
  app.listDeployments(app, app.state.tokens.projectId);

  function renderDeployments (project, deployments) {
    return html`
      <puz-deployments>
        <div class="heading-container">
          <h2>
            Deployments
          </h3>
          <div>
            <button onclick=${app.createDeployment.bind(null, app, project.id)}>Scale Up</button>
          </div>
        </div>
        ${deployments.map((deployment, deploymentIndex) => html`
          <puz-deployment key=${deployment.id} class="deployment-status-${deployment.status} ${app.state.deploymentExpands[deployment.id] ? 'expanded' : ''}">
            <puz-deployment-heading onclick=${app.toggleExpanded.bind(null, app, 'deploymentExpands', deployment.id)}>
              <div class="nowrap cutoff">${deployment.id}</div>
              <div><span class="label label-${deployment.status}">${deployment.status}</span></div>
              <div class="nowrap">${format(new Date(parseFloat(deployment.dateCreated)), 'dd/MM/yyyy hh:mm:ss')}</div>
            </puz-deployment-heading>

            ${app.state.deploymentExpands[deployment.id] ? html`
              <puz-deployment-content>

                  ${mithril(tabbed, {
                    app,
                    tabs: [{
                      key: 'buildLogs',
                      title: html`<span>Build Log</span>`,
                      defaultActive: deployment.status === 'pending',
                      content: deploymentLog(app, project, deployment)
                    }, {
                      key: 'logs',
                      title: html`<span>Logs</span>`,
                      defaultActive: deployment.status !== 'pending',
                      content: liveLog(app, project, deployment)
                    }, {
                        key: 'settings',
                        title: html`<span>Settings</span>`,
                        content: settings(app, project, deployment)
                    }]
                  })}

              </puz-deployment-content>
            ` : ''}
          </puz-deployment>
        `)}
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
          <strong>Repository:</strong> <a href="https://github.com/${project.owner}/${project.repo}" target="_blank">https://github.com/${project.owner}/${project.repo}</a>
        </div>

        ${deployments.length > 0 ? renderDeployments(project, deployments) : null}
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
            <div class="loading" ${app.state.loading === 0 ? 'off' : ''}><div>Loading project</div></div>

            ${project ? renderProject(project, deployments) : null}
          </section>
        </main>
      `;
    }
  };
};
