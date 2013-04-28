
/**
 * dependencies
 */

var keycode = require('keycode');

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

exports.bind = function(keys, fn){
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

exports.clear = function(e){
  var code = e.keyCode;
  if (!(code in modifiers)) return;
  this[modifiers[code]] = null;
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
