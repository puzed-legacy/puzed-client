const setPath = require('spath/setPath');
const m = require('mithril');
const html = require('hyperx')(m);
const mui = require('mithui');

const menu = require('../../components/menu');

module.exports = function (app) {
  let showGenericError;

  return {
    oncreate: () => {
      app.listProviders(app);
    },

    view: () => {
      if (app.state.loggedIn) {
        return html`
          <main>
            ${m(menu, { app })}

            <p>You are already logged in.</p>
          </main>
        `;
      }

      const loginForm = m(mui.form, {
        fields: [{
          name: 'email',
          label: 'Email Address',
          component: mui.textInput,
          autoFocus: true
        },
        {
          name: 'password',
          label: 'Password',
          component: mui.passwordInput
        }
        ],
        onSubmit: (event, data) => {
          showGenericError = false;
          event.preventDefault();
          const button = event.target.querySelector('form > button');
          button.disabled = true;

          app.login(app, data)
            .then(service => {
              button.disabled = false;
              setPath('/');
            }).catch(_ => {
              showGenericError = true;
              button.disabled = false;
              app.emitStateChanged();
            });
        }
      });

      return html`
        <main>
          ${m(menu, { app })}
    
          <section>
            <h1>Login</h1>

            ${showGenericError
              ? html`
              <div class="alert alert-danger">
                No user could be found with the details you provided
              </div>
              `
              : null}

            ${loginForm}

            <h2>Alternative Logins</h2>
            ${app.state.providers
              .filter(provider => provider.ssoEnabled)
              .map(provider => {
                return html`
                  <a class="btn-social btn-${provider.driver}" href=${provider.ssoUrl}>
                    <svg height="32" viewBox="0 0 16 16" version="1.1" width="32" aria-hidden="true">
                      <path fill-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
                    </svg>
                    <div>Sign in with ${provider.title}</div>
                  </a>
                `;
              })}
          </section>
        </main>
      `;
    }
  };
};
