const menu = require('../components/menu');

module.exports = function (app, html) {
  return html`
    <main oncreate=${app.listProjects.bind(null, app)}>
      ${menu(app, html)}
 
      <section>
        <h2>Your Projects</h2>
        <a href="/projects/create">Create new project</a>
        <p>Select a project you would like to manage.</p>
        <div class="loading" ${app.state.loading === 0 ? 'off' : ''}><div>Loading your projects</div></div>
        <ul>
          ${(app.state.projects || []).map(project => {
            return html`
              <li>
                <a href="/projects/${project.id}">${project.name}</a>
              </li>`;
          })}
        </ul>
      </section>
    </main>
  `;
};
