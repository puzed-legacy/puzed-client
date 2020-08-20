const menu = require('../components/menu');
const Convert = require('ansi-to-html');
const convert = new Convert();

module.exports = function (app, html) {
  const project = app.state.projects.find(project => project.id === app.state.tokens.projectId);
  const deployments = app.state.deployments.filter(deployment => deployment.projectid === app.state.tokens.projectId);

  function handleCreation () {
    app.readProject(app, app.state.tokens.projectId);
    app.listDeployments(app, app.state.tokens.projectId);
  }

  function renderDeployments () {
    return html`
      <div>
        <h2>Deployments</h3>
        ${deployments.map(deployment => html`
          <div>
            <strong>${deployment.status}</strong> ${deployment.id}
            <h3>Build Log</h4>
            <pre class="terminal"><code innerHTML=${convert.toHtml(
              app.state.buildLogs[deployment.id] || deployment.buildlog || 'No build log found'
            )}></code></pre>
          </div>
        `)}
      </div>
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

        <h2>${project && project.name}</h2>
        <h3>Build Log</h3>  
        <pre class="terminal"><code>${project && app.state.buildLogs[project.id]}</code></pre>

      </section>
    </main>
  `;
};
