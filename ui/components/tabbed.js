const mithril = require('mithril');
const html = require('hyperx')(mithril);

function tabbed (vnode) {
  const tabs = vnode.attrs.tabs;

  const state = {
    activeTab: tabs.find(tab => tab.defaultActive)
  };

  function setActiveTab (tab) {
    return event => {
      event.preventDefault();
      state.activeTab = tab;
      // mithril.redraw()
    };
  }

  return {
    view: () => {
      return html`
        <puz-tabbed>
          <puz-tabbed-menu>
            ${tabs.map(tab => {
              return html`
                <a href="" ${tab.disabled ? 'disabled' : ''} key=${tab.key} class="${tab === state.activeTab ? 'active' : ''}" onclick=${setActiveTab(tab)}>${tab.title}</a>
              `;
            })}
          </puz-tabbed-menu>

          ${state.activeTab && [html`
            <puz-tabbed-content key=${state.activeTab.key}>
              ${mithril(state.activeTab.content)}
            </puz-tabbed-content>
          `]}
        </puz-tabbed>
      `;
    }
  };
}

module.exports = tabbed;
