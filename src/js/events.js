export default class Events {
  constructor() {
    this.listeners = {};
  }

  on(event, listener) {
    this.listeners[event] = (this.listeners[event] || []).concat(listener);
  }

  off(event, listener) {
    this.listeners[event] = this.listeners[event].filter(l => l !== listener);
  }

  once(event, callback) {
    var onceListener = () => {
      this.off(event, onceListener);
      callback();
    };

    this.on(event, onceListener);
  }

  trigger(event) {
    var args = [].slice.call(arguments, 1);

    (this.listeners[event] || []).forEach(listener => {
      listener.apply(this, args);
    });
  }
}
