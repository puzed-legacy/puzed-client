const m = require('mithril');
const html = require('hyperx')(m);
const mui = require('mithui');

const menu = require('../../components/menu');

function createForm (app) {
  return m(mui.form, {
    fields: [
      {
        name: 'provider',
        label: 'Provider',
        component: mui.select,
        options: [
          {
            value: 'github',
            label: 'GitHub Official'
          }
        ],
        initialValue: 'github'
      }
    ],
    onSubmit: (event, data) => {
      event.preventDefault();
      // const button = event.target.querySelector('form > button');
      // button.disabled = true;
      alert('oh');
      // app.createService(app, {
      //   ...data,
      //   provider: 'github',
      //   providerRepositoryId
      // }).then(service => {
      //   button.disabled = false;
      //   setPath('/services/' + service.id);
      // }).catch(error => {
      //   console.log(error);
      //   button.disabled = false;
      // });
    }
  });
}

module.exports = function (app) {
  return {
    view: ({ attrs }) => {
      return html`
        <main>
          ${menu(app, html)}

          <section>
            <h2>Link with a new provider</h2>
            <a href="https://github.com/apps/puzed-local/installations/new">Login via GitHub</a>
            ${createForm(app)}
          </section>
        </main>
      `;
    }
  };
};
