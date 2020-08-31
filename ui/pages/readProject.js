const menu = require('../components/menu');
const createTerminal = require('../components/terminal');
const createTabbed = require('../components/tabbed');

const format = require('date-fns/format');

module.exports = function (app, html) {
  const project = app.state.projects.find(project => project.id === app.state.tokens.projectId);
  const deployments = app.state.deployments.filter(deployment => deployment.projectid === app.state.tokens.projectId);

  function handleCreation () {
    app.readProject(app, app.state.tokens.projectId);
    app.listDeployments(app, app.state.tokens.projectId);
  }

  function destroyDeployment (project, deployment) {
    app.destroyDeployment(app, project.id, deployment.id);
  }

  function renderDeployments () {
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
          <puz-deployment key=${deployment.id} class="deployment-status-${deployment.status}">
            <puz-deployment-heading onclick=${app.toggleExpanded.bind(null, app, 'deploymentExpands', deployment.id)}>
              <div class="nowrap cutoff">${deployment.id}</div>
              <div><span class="label label-${deployment.status}">${deployment.status}</span></div>
              <div class="nowrap">${format(new Date(parseFloat(deployment.datecreated)), 'dd/MM/yyyy hh:mm:ss')}</div>
            </puz-deployment-heading>

            ${app.state.deploymentExpands[deployment.id] ? html`<puz-deployment-content>
              ${createTabbed(app, html, {
                tabs: [{
                  key: 'buildLogs',
                  title: html`<span>Build Log</span>`,
                  defaultActive: deployment.status === 'pending',
                  content: () => html`
                    <puz-build-log oncreate=${app.readDeploymentBuildLog.bind(null, app, project.id, deployment.id)}>
                      ${createTerminal(app.state.buildLogs[deployment.id] || deployment.buildlog || 'No build log found')}
                    </puz-build-log>
                  `
                }, {
                  key: 'logs',
                  title: html`<span>Logs</span>`,
                  defaultActive: deployment.status !== 'pending',
                  content: () => {
                    const reconnect = event => {
                      event.preventDefault();
                      app.startDeploymentLogs(app, project.id, deployment.id);
                    };

                    return html`
                      <puz-live-log oncreate=${app.startDeploymentLogs.bind(null, app, project.id, deployment.id)} onremove=${app.stopDeploymentLogs.bind(null, app, project.id, deployment.id)}>
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
                        ${createTerminal((app.state.liveLogs[deployment.id] && app.state.liveLogs[deployment.id].data) || 'No logs found')}
                      </puz-live-log>
                    `;
                  }
                }, {
                    key: 'settings',
                    title: html`<span>Settings</span>`,
                    content: () => html`
                      <puz-build-log>
                        <button onclick=${destroyDeployment.bind(null, project, deployment)}>Destroy</button>
                      </puz-build-log>
                    `
                }]
              })}
            </puz-deployment-content>
            ` : ''}
          </puz-deployment>
        `)}
      </puz-deployments>
    `;
  }

  function renderProject () {
    return html`
      <div>
        <h1>${project.name}</h2>
        <div>
          <strong>Domain:</strong> <a href="https://${project.domain}" target="_blank">https://${project.domain}</a>
        </div>

        <div>
          <strong>Web Port:</strong> ${project.webport}
        </div>

        <div>
          <strong>Repository:</strong> <a href="https://github.com/${project.owner}/${project.repo}" target="_blank">https://github.com/${project.owner}/${project.repo}</a>
        </div>

        ${deployments.length > 0 ? renderDeployments() : null}
      </div>
    `;
  }

  return html`
    <main oncreate=${handleCreation}>
      ${menu(app, html)}

      <section>
        <div class="loading" ${app.state.loading === 0 ? 'off' : ''}><div>Loading project</div></div>

        ${project ? renderProject() : null}
      </section>
    </main>
  `;
};
