const menu = require('../components/menu');

function selectRepository (app, html) {
  return html`
    <main oncreate=${app.listRepositories}>
      ${menu(app, html)}
 
      <section>
        <h2>Your Repositories</h2>
        <p>Select a repository you would like to deploy.</p>
        <ul>
          ${(app.state.repositories || []).map(repository => {
            return html`
              <li>
                <a href="/projects/create?from=${repository.full_name}">${repository.name}</a>
              </li>`
          })}
        </ul>
      </section>
    </main>
  `;
}

function setupProject (app, html, url) {
  return html`
    <main>
      ${menu(app, html)}
 
      <section>
        <h2>Your Repositories</h2>
        <puz-form-field>
          <puz-form-label>Repository</puz-form-label>
          <puz-form-input>
            ${url.searchParams.get('from')}
          </puz-form-input>
        </puz-form-field>

        <puz-form-field>
          <puz-form-label>Project Name</puz-form-label>
          <puz-form-input>
            <input value="my-${url.searchParams.get('from').split('/')[1]}-1" autofocus />
          </puz-form-input>
        </puz-form-field>

        <puz-form-field>
          <puz-form-label>Image</puz-form-label>
          <puz-form-input>
            <input value="node:12" />
          </puz-form-input>
        </puz-form-field>

        <puz-form-field>
          <puz-form-label>Web Port</puz-form-label>
          <puz-form-input>
            <input value="80" />
          </puz-form-input>
        </puz-form-field>

        <puz-form-field>
          <puz-form-label>Domain</puz-form-label>
          <puz-form-input>
            <input value="example.com" />
          </puz-form-input>
        </puz-form-field>

        <puz-form-actions>
          <button class="primary">Deploy</button>
        </puz-form-actions>
      </section>
    </main>
  `;
}

module.exports = function (app, html) {
  const url = new URL(window.location.href)

  if (url.searchParams.get('from')) {
    return setupProject(app, html, url)
  }

  return selectRepository(app, html)
};
