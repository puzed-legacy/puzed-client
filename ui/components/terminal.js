const minthril = require('minthril');
const html = require('hyperx')(minthril);
const Convert = require('ansi-to-html');
const convert = new Convert();

function createTerminal (content) {
  return minthril.createComponent(function (state, draw, component) {
    function keepToBottom (element, enabled) {
      element.addEventListener('scroll', () => {
        const heightTop = element.scrollTop;
        const heightPosition = element.scrollHeight - element.offsetHeight;

        state.keepToBottom = heightTop > heightPosition - 10;
      });
    }

    function handleCreate (event) {
      state.keepToBottom = true;
      const element = event.dom;
      element.scrollTop = 10000000000000;

      keepToBottom(element);

      state.timer = setInterval(() => {
        if (state.keepToBottom) {
          element.scrollTop = 10000000000000;
        }
      }, 300);
    }

    function handleUpdate (event) {
      const element = event.dom;
      element.scrollTop = 10000000000000;
    }

    function handleDestroy (event) {
      clearInterval(state.timer);
    }

    const contentFormatted = convert.toHtml(content.replace(/</g, '&lt;'));

    return html`
      <pre oncreate=${handleCreate} onupdate=${handleUpdate} ondestroy=${handleDestroy} class="terminal"><code innerHTML=${contentFormatted}></code></pre> 
    `;
  });
}

module.exports = createTerminal;
