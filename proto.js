
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

    // Do not match if modifiers are pressed and handler has none defined:
    if (this.modifiers === true && mlen == 0) break;

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
  var fns = this.listeners
    , all;

  // unbind all
  if (0 == arguments.length) {
    this.listeners = {};
    return this;
  }

  // parse
  all = parseKeys(keys);

  // unbind keys
  if (1 == arguments.length) {
    for (var i = 0; i < all.length; ++i) {
      fns[all[i].key] = [];
    }
    return this;
  }

  // unbind `fn`
  for (var i = 0; i < all.length; ++i) {
    fns = fns[all[i].key];
    if (!fns) continue;
    for (var j = 0; j < fns.length; ++j) {
      if (fn != fns[j].fn) continue;
      if (!matches(fns[j], all[i])) continue;
      fns.splice(j, 1);
    }
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
  var all = parseKeys(keys)
    , fns = this.listeners;

  for (var i = 0; i < all.length; ++i) {
    (fns[all[i].key] = fns[all[i].key] || []).push(all[i]);
    all[i].fn = fn;
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

/**
 * Parse the given `keys`.
 *
 * @param {String} keys
 * @return {Array}
 * @api private
 */

function parseKeys(keys){
  keys = keys.replace('super', exports.super);

  var all = ',' != keys
    ? keys.split(/ *, */)
    : [','];

  var ret = [];
  for (var i = 0; i < all.length; ++i) {
    if ('' == all[i]) continue;
    var mods = all[i].split(/ *\+ */);
    var key = keycode(mods.pop() || ',');
    ret.push({ mods: mods, key: key });
  }

  return ret;
}

/**
 * Check if the given `a` matches `b`.
 *
 * @param {Object} a
 * @param {Object} b
 * @return {Boolean}
 */

function matches(a, b){
  return 0 == b.mods.length || eql(a, b);
}

/**
 * shallow eql util.
 *
 * TODO: move to yields/eql
 *
 * @param {Array} a
 * @param {Array} b
 * @return {Boolean}
 * @api private
 */

function eql(a, b){
  a = a.mods.sort().toString();
  b = b.mods.sort().toString();
  return a == b;
}
