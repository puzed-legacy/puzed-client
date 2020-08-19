const menu = require('../components/menu');

module.exports = function (app, html) {
  const project = app.state.projects.find(project => project.id === app.state.tokens.projectId);

  return html`
    <main oncreate=${app.readProject.bind(null, app, app.state.tokens.projectId)}>
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
