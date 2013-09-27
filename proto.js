
/**
 * dependencies
 */

var keycode = require('keycode')
  , event = require('event')
  , os = require('os');

/**
 * modifiers.
 */

var modifiers = {
  91: 'command',
  93: 'command',
  16: 'shift',
  17: 'ctrl',
  18: 'alt'
};

/**
 * Super key.
 */

exports.super = 'mac' == os
  ? 'command'
  : 'ctrl';

/**
 * handle the given `KeyboardEvent` or bind
 * a new `keys` handler.
 *
 * @param {String|KeyboardEvent} e
 * @param {Function} fn
 */

exports.handle = function(e, fn){
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
    this.super = exports.super == modifiers[e.which];
    this[modifiers[e.which]] = true;
    this.modifiers = true;
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
        break;
      }
    }

    invoke && handle.fn(e);
  }
};

/**
 * destroy this `k` dispatcher instance.
 */

exports.destroy = function(){
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

exports.unbind = function(keys, fn){
  var listeners = this.listeners
    , index
    , key
    , len;

  // unbind all
  if (0 == arguments.length) {
    this.listeners = {};
    return this;
  }

  keys = keys.split(/ *, */);
  for (var i = 0, len = keys.length; i < len; ++i) {
    key = keycode(keys[i]);

    // no listeners
    if (!listeners[key]) continue;

    // unbind fn
    if (2 == arguments.length) {
      for (var j = 0; j < listeners[key].length; ++j) {
        if (fn == listeners[key][j].fn) {
          listeners[key].splice(j, 1);
        }
      }
      continue;
    }

    // unbind all keys
    listeners[key] = [];
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

exports.bind = function(keys, fn){
  var fns = this.listeners
    , mods = []
    , key;

  // superkey
  keys = keys.replace('super', exports.super);

  // support `,`
  var all = ',' != keys
    ? keys.split(/ *, */)
    : [','];

  // bind
  for (var i = 0, len = all.length; i < len; ++i) {
    if ('' == all[i]) continue;
    mods = all[i].split(/ *\+ */);
    key = keycode(mods.pop() || ',');
    if (!fns[key]) fns[key] = [];
    fn.mods = mods;
    fns[key].push({ mods: mods, fn: fn });
  }

  return this;
};

/**
 * clear all modifiers on `keyup`.
 */

exports.clear = function(e){
  var code = e.keyCode;
  if (!(code in modifiers)) return;
  this[modifiers[code]] = null;
  this.modifiers = this.command
    || this.shift
    || this.ctrl
    || this.alt;
};

/**
 * Ignore all input elements by default.
 *
 * @param {Event} e
 * @return {Boolean}
 */

exports.ignore = function(e){
  var el = e.target || e.srcElement;
  var name = el.tagName.toLowerCase();
  return 'textarea' == name
    || 'select' == name
    || 'input' == name;
};
