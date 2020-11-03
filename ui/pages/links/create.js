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
    oncreate: () => {
      app.listProviders(app);
    },

    view: ({ attrs }) => {
      return html`
        <main>
          ${m(menu, { app })}

          <section>
            <h1>Link with a new provider</h1>
            ${app.state.providers
              .map(provider => {
                return html`
                  <a href=${provider.installUrl}>
                    Link with ${provider.title}
                  </a>
                `;
              })}

            <!-- ${createForm(app)} -->
          </section>
        </main>
      `;
    }
  };
};
