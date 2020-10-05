const setPath = require('spath/setPath');
const m = require('mithril');
const html = require('hyperx')(m);
const mui = require('mithui');

const menu = require('../../components/menu');

module.exports = function (app) {
  let errors;

  return {
    view: () => {
      const createForm = m(mui.form, {
        fields: [{
          name: 'domain',
          label: 'Domain Name',
          errors: errors && errors.fields && errors.fields.domain,
          component: mui.textInput,
          autoFocus: true
        }],
        onSubmit: (event, data) => {
          event.preventDefault();
          const button = event.target.querySelector('form > button');
          button.disabled = true;

          app.createDomain(app, data)
            .then(domain => {
              button.disabled = false;
              setPath('/domains');
            }).catch(error => {
              errors = error.data;
              app.emitStateChanged();
              button.disabled = false;
            });
        }
      });

      return html`
        <main>
          ${menu(app, html)}
    
          <section>
            <h1>Create a domain</h1>

            ${createForm}
          </section>
        </main>
      `;
    }
  };
};
