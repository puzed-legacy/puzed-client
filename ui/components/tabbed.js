const minthril = require('minthril');

function createTabbed (app, html, options) {
  return minthril.createComponent(function (state, draw, component) {
    function setActiveTab (tab) {
      return event => {
        event.preventDefault();
        state.activeTab = tab;
        draw();
      };
    }

    state.activeTab = options.tabs.find(tab => tab.active) || state.activeTab || options.tabs.find(tab => tab.defaultActive);

    return html`
      <puz-tabbed>
        <puz-tabbed-menu>
          ${options.tabs.map(tab => {
            return html`
              <a href="" ${tab.disabled ? 'disabled' : ''} key=${tab.key} class="${tab.key === state.activeTab.key ? 'active' : ''}" onclick=${setActiveTab(tab)}>${tab.title}</a>
            `;
          })}
        </puz-tabbed-menu>

        ${state.activeTab && [html`
          <puz-tabbed-content key=${state.activeTab.key}>
            ${state.activeTab.content()}
          </puz-tabbed-content>
        `]}
      </puz-tabbed>
    `;
  });
}

module.exports = createTabbed;
