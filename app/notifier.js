const EventEmitter = require('events');
const { throttle } = require('throttle-debounce');

function createNotifier (fn) {
  const notifyIds = window.d = [];
  let notifyCurrentHash = '';
  const eventEmitter = window.em = new EventEmitter();
  const syncNotifier = throttle(100, false, () => {
    const newNotifyCurrentHash = Array.from(new Set(notifyIds));
    if (newNotifyCurrentHash !== notifyCurrentHash) {
      fn(notifyIds, eventEmitter.emit.bind(eventEmitter));
      notifyCurrentHash = newNotifyCurrentHash;
    }
  }, false);
  const notifier = {
    on: (id, handler) => {
      notifyIds.push(id);
      eventEmitter.addListener(id, handler);
      syncNotifier();
    },
    off: (id, handler) => {
      notifyIds.splice(notifyIds.indexOf(id), 1);
      eventEmitter.removeListener(id, handler);
      syncNotifier();
    }
  };

  return notifier;
}

module.exports = createNotifier;
