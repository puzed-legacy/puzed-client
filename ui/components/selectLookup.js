const m = require('mithril');

function selectLookup (vnode) {
  let collapsed = true;
  let forceAlignLeft = false;
  let forceAlignTop = false;

  function handleInput (state, options) {
    return event => {
      state.value = event.target.value;
      options.onInput && options.onInput(event, {
        name: options.name,
        value: state.value
      });
    };
  }

  function handleDocumentMouseUp (event) {
    if (!vnode.dom.contains(event.target)) {
      collapsed = true;
      m.redraw();
    }
  }

  function handleFocusIn (event) {
    if (!collapsed) {
      return;
    }

    collapsed = false;
    const dropdownHead = vnode.dom.querySelector('mui-selectLookup-head');
    const dropdownBody = vnode.dom.querySelector('mui-selectLookup-body');
    dropdownBody.style.opacity = 0;

    window.requestAnimationFrame(() => {
      dropdownBody.style.minWidth = dropdownHead.offsetWidth + 'px';

      if (parseInt(dropdownHead.parentNode.offsetLeft) < 100) {
        forceAlignLeft = true;
      } else {
        forceAlignLeft = false;
      }

      if (parseInt(dropdownBody.offsetHeight) + parseInt(dropdownBody.parentNode.offsetTop) > (window.scrollY + window.innerHeight - 50)) {
        forceAlignTop = true;
      } else {
        forceAlignTop = false;
      }

      m.redraw();

      window.requestAnimationFrame(() => {
        dropdownBody.style.opacity = 1;
      });
    });
  }

  function handleFocusOut (event) {
    if (!vnode.dom.contains(event.relatedTarget)) {
      collapsed = true;
      m.redraw();
    }
  }

  function handleHeadClick (event) {
    if (!collapsed) {
      setTimeout(() => vnode.dom.blur());
    }
  }

  const state = {
    value: vnode.attrs.initialValue || ''
  };

  return {
    oncreate: (vnode) => {
      document.addEventListener('mouseup', handleDocumentMouseUp);
      vnode.dom.addEventListener('focusin', handleFocusIn);
      vnode.dom.addEventListener('focusout', handleFocusOut);
      vnode.dom.querySelector('input').value = state.value;
    },

    onremove: (vnode) => {
      document.removeEventListener('mouseup', handleDocumentMouseUp);
      vnode.dom.removeEventListener('focusin', handleFocusIn);
      vnode.dom.removeEventListener('focusout', handleFocusOut);
    },

    view: (vnode) => {
      const options = vnode.attrs;

      let classes = vnode.attrs.class || '';

      if (forceAlignLeft) {
        classes = classes.replace('align-right', '');
      }

      if (forceAlignTop && !classes.includes('align-up')) {
        classes = classes + ' align-up';
      }

      return m('mui-selectLookup', { tabindex: 0, class: classes },
        m('mui-selectLookup-head', { onmousedown: handleHeadClick },
          m('input', {
            id: options.id,
            autoFocus: options.autoFocus,
            name: options.name,
            oninput: handleInput(state, options)
          })
        ),
        m('mui-selectLookup-body', { hidden: collapsed },
          ...(app.state.repositories || [])
            .map(repository =>
              m('div',
                m('strong', repository.name),
                m('div', repository.description)
              )
            )
        )
      );
    }
  };
}

module.exports = selectLookup;
