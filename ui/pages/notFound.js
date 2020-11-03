const m = require('mithril');
const html = require('hyperx')(m);

const menu = require('../components/menu');

module.exports = function (app) {
  return {
    view: () => {
      return html`
        <main>
          ${m(menu, { app })}
          
          <section>
            <h1>Not Found</h1>
            <p>The requested page could not be found.</p>
          </section>
        </main>
      `;
    }
  };
};
