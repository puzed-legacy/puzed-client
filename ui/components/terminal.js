const minthril = require('minthril');
const html = require('hyperx')(minthril);
const Convert = require('ansi-to-html');
const convert = new Convert();

function terminal (content) {
  const state = {};

  function keepToBottom (element, enabled) {
    element.addEventListener('scroll', () => {
      const heightTop = element.scrollTop;
      const heightPosition = element.scrollHeight - element.offsetHeight;

      state.keepToBottom = heightTop > heightPosition - 10;
    });
  }

  return {
    oncreate: (vnode) => {
      state.keepToBottom = true;
      const element = vnode.dom;
      element.scrollTop = 10000000000000;

      keepToBottom(element);

      state.timer = setInterval(() => {
        if (state.keepToBottom) {
          element.scrollTop = 10000000000000;
        }
      }, 300);
    },

    onremove: (vnode) => {
      clearInterval(state.timer);
    },

    view: (vnode) => {
      const contentFormatted = convert.toHtml(vnode.attrs.content.replace(/</g, '&lt;'));

      return html`
        <pre class="terminal"><code innerHTML=${contentFormatted}></code></pre> 
      `;
    }
  };
}

module.exports = terminal;
