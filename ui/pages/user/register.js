const setPath = require('spath/setPath');
const m = require('mithril');
const html = require('hyperx')(m);
const mui = require('mithui');

const menu = require('../../components/menu');

module.exports = function (app) {
  let errors;

  return {
    view: () => {
      if (app.state.loggedIn) {
        return html`
          <main>
            ${menu(app, html)}

            <p>You are already logged in.</p>
          </main>
        `;
      }

      const registrationForm = m(mui.form, {
        fields: [{
          name: 'email',
          label: 'Email Address',
          errors: errors && errors.fields && errors.fields.email,
          component: mui.textInput,
          autoFocus: true
        },
        {
          name: 'password',
          label: 'Password',
          errors: errors && errors.fields && errors.fields.password,
          component: mui.passwordInput
        },
        {
          name: 'passwordConfirmation',
          label: 'Enter your password again',
          errors: errors && errors.fields && errors.fields.passwordConfirmation,
          component: mui.passwordInput
        }
        ],
        onSubmit: (event, data) => {
          event.preventDefault();
          const button = event.target.querySelector('form > button');
          button.disabled = true;

          app.register(app, data)
            .then(user => {
              button.disabled = false;
              setPath('/');
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
            <h1>Create an account</h1>

            ${registrationForm}
          </section>
        </main>
      `;
    }
  };
};
