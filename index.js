
/**
 * dependencies.
 */

var keycode = require('keycode')
  , event = require('event')
  , merge = require('merge');

/**
 * modifiers.
 */

var modifiers = {
  91: 'command',
  16: 'shift',
  17: 'ctrl',
  18: 'alt'
};

/**
 * create a new dispatcher with `el`.
 *
 * example:
 *
 *      var k = require('k')(window);
 *      k('shift + tab', function(){});
 *
 * @param {Element} el
 * @return {Function}
 */

module.exports = function(el){
  function k(e, fn){ k.handle(e, fn) };
  k._handle = proto.handle.bind(k);
  k._clear = proto.clear.bind(k);
  event.bind(el, 'keydown', k._handle, false);
  event.bind(el, 'keyup', k._clear, false);
  event.bind(el, 'focus', k._clear, false);
  k.listeners = {};
  merge(k, proto);
  k.el = el;
  return k;
};

/**
 * proto
 */

var proto = {};

/**
 * handle the given `KeyboardEvent` or bind
 * a new `keys` handler.
 *
 * @param {String|KeyboardEvent} e
 * @param {Function} fn
 */

proto.handle = function(e, fn){
  var all = this.listeners[e.which]
    , len = all && all.length
    , ignore = this.ignore
    , invoke = true
    , handle
    , mods
    , mlen;

  // bind
  if (fn) return this.bind(e, fn);

  // modifiers
  if (modifiers[e.which]) {
    this[modifiers[e.which]] = true;
    return;
  }

  // ignore
  if (ignore && ignore(e)) return;

  // match
  for (var i = 0; i < len; ++i) {
    invoke = true;
    handle = all[i];
    mods = handle.mods;
    mlen = mods.length;

    for (var j = 0; j < mlen; ++j) {
      if (!this[mods[j]]) {
        invoke = null;
        continue;
      }
    }

    invoke && handle.fn(e);
  }
};

/**
 * destroy this `k` dispatcher instance.
 */

proto.destroy = function(){
  event.unbind(this.el, 'keydown', this._handle);
  event.unbind(this.el, 'keyup', this._clear);
  event.unbind(this.el, 'focus', this._clear);
  this.listeners = {};
};

/**
 * unbind the given `keys` with optional `fn`.
 *
 * example:
 *
 *      k.unbind('enter, tab', myListener); // unbind `myListener` from `enter, tab` keys
 *      k.unbind('enter, tab'); // unbind all `enter, tab` listeners
 *      k.unbind(); // unbind all listeners
 *
 * @param {String} keys
 * @param {Function} fn
 * @return {self}
 */

proto.unbind = function(keys, fn){
  if (keys) {
    var index, key;
    keys = keys.split(/ *, */);
    for (var i = 0, len = keys.length; i < len; ++i) {
      key = keycode(keys[i]);
      if (fn) {
        index = this.listeners[key].indexOf(fn);
        this.listeners[key].splice(i, 1);
      } else {
        this.listeners[key] = [];
      }
    }
  } else {
    this.listeners = {};
  }
  return this;
};

/**
 * bind the given `keys` to `fn`.
 *
 * example:
 *
 *      k.bind('shift + tab, ctrl + a', function(e){});
 *
 * @param {String} keys
 * @param {Function} fn
 * @return {self}
 */

proto.bind = function(keys, fn){
  var all = keys.split(/ *, */)
    , fns = this.listeners
    , len = all.length
    , mods = []
    , key;

  for (var i = 0; i < len; ++i) {
    mods = all[i].split(/ *\+ */);
    key = keycode(mods.pop());
    if (!fns[key]) fns[key] = [];
    fns[key].push({ mods: mods, fn: fn });
  }

  return this;
};

/**
 * clear all modifiers on `keyup`.
 */

proto.clear = function(){
  for (var k in modifiers) {
    this[modifiers[k]] = null;
  }
};
