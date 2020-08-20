const setPath = require('spath/setPath');

const menu = require('../components/menu');

function selectRepository (app, html) {
  return html`
    <main oncreate=${app.listRepositories.bind(null, app)}>
      ${menu(app, html)}
 
      <section>
        <h2>Your Repositories</h2>
        <p>Select a repository you would like to deploy.</p>
        <div class="loading" ${app.state.loading === 0 ? 'off' : ''}><div>Loading your repositories</div></div>
        <ul>
          ${(app.state.repositories || []).map(repository => {
            return html`
              <li>
                <a href="/projects/create?from=${repository.full_name}">${repository.name}</a>
              </li>`;
          })}
        </ul>
      </section>
    </main>
  `;
}

function setupProject (app, html, url) {
  const from = url.searchParams.get('from').split('/');
  const owner = from[0];
  const repo = from[1];

  function deploy (event) {
    event.preventDefault();

    app.createProject(app, {
      image: event.target.querySelector('[name="image"]').value,
      domain: event.target.querySelector('[name="domain"]').value,
      name: event.target.querySelector('[name="name"]').value,
      owner,
      repo,
      webport: event.target.querySelector('[name="webPort"]').value
    }).then(project => {
      setPath('/projects/' + project.id);
    });
  }

  return html`
    <main>
      ${menu(app, html)}
 
      <section>
        <h2>Your Repositories</h2>
        <form onsubmit=${deploy}>
          <puz-form-field>
            <puz-form-label>Repository</puz-form-label>
            <puz-form-input>
              ${url.searchParams.get('from')}
            </puz-form-input>
          </puz-form-field>

          <puz-form-field>
            <puz-form-label>Project Name</puz-form-label>
            <puz-form-input>
              <input name="name" value="my-${owner}-${repo}-1" autofocus />
            </puz-form-input>
          </puz-form-field>

          <puz-form-field>
            <puz-form-label>Image</puz-form-label>
            <puz-form-input>
              <input name="image" value="node:12" />
            </puz-form-input>
          </puz-form-field>

          <puz-form-field>
            <puz-form-label>Web Port</puz-form-label>
            <puz-form-input>
              <input name="webPort" value="8000" />
            </puz-form-input>
          </puz-form-field>

          <puz-form-field>
            <puz-form-label>Domain</puz-form-label>
            <puz-form-input>
              <input name="domain" value="something.puzed.net" />
            </puz-form-input>
          </puz-form-field>

          <puz-form-actions>
            <button class="primary">Deploy</button>
          </puz-form-actions>
        </form>
      </section>
    </main>
  `;
}

module.exports = function (app, html) {
  const url = new URL(window.location.href);

  if (url.searchParams.get('from')) {
    return setupProject(app, html, url);
  }

  return selectRepository(app, html);
};
