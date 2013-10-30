
/**
 * dependencies
 */

var sequence = require('k-sequence')
  , keycode = require('keycode')
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
 * Handle the given `KeyboardEvent` or bind
 * a new `keys` handler.
 *
 * @param {String|KeyboardEvent} e
 * @param {Function} fn
 * @api private
 */

exports.handle = function(e, fn){
  var ignore = this.ignore;
  var event = e.type;
  var code = e.which;

  // bind
  if (fn) return this.bind(e, fn);

  // modifiers
  var mod = modifiers[code];
  if ('keydown' == event && mod) {
    this.super = exports.super == mod;
    this[mod] = true;
    this.modifiers = true;
    return;
  }

  // ignore
  if (ignore && ignore(e)) return;

  // listeners
  var all = this.listeners;

  // match
  for (var i = 0; i < all.length; ++i) {
    var invoke = true;
    var obj = all[i];
    var seq = obj.seq;
    var mods = obj.mods;
    var fn = seq || obj.fn;

    if (!seq && code != obj.code) continue;
    if (event != obj.event) continue;

    for (var j = 0; j < mods.length; ++j) {
      if (!this[mods[j]]) {
        invoke = null;
        break;
      }
    }

    invoke && fn(e);
  }
};

/**
 * Destroy this `k` dispatcher instance.
 *
 * @api public
 */

exports.destroy = function(){
  event.unbind(this.el, 'keydown', this._handle);
  event.unbind(this.el, 'keyup', this._handle);
  event.unbind(this.el, 'keyup', this._clear);
  event.unbind(this.el, 'focus', this._clear);
  this.listeners = [];
};

/**
 * Unbind the given `keys` with optional `fn`.
 *
 * example:
 *
 *      k.unbind('enter, tab', myListener); // unbind `myListener` from `enter, tab` keys
 *      k.unbind('enter, tab'); // unbind all `enter, tab` listeners
 *      k.unbind(); // unbind all listeners
 *
 * @param {String} keys
 * @param {Function} fn
 * @return {k}
 * @api public
 */

exports.unbind = function(keys, fn){
  var fns = this.listeners
    , len = fns.length
    , all;

  // unbind all
  if (0 == arguments.length) {
    this.listeners = [];
    return this;
  }

  // parse
  all = parseKeys(keys);

  // unbind
  for (var i = 0; i < all.length; ++i) {
    for (var j = 0, obj; j < len; ++j) {
      obj = fns[j];
      if (!obj) continue;
      if (fn && obj.fn != fn) continue;
      if (obj.key != all[i].key) continue;
      if (!matches(obj, all[i])) continue;
      fns.splice(j--, 1);
    }
  }

  return this;
};

/**
 * Bind the given `keys` to `fn` with optional `event`
 *
 * example:
 *
 *      k.bind('shift + tab, ctrl + a', function(e){});
 *
 * @param {String} event
 * @param {String} keys
 * @param {Function} fn
 * @return {k}
 * @api public
 */

exports.bind = function(event, keys, fn){
  var fns = this.listeners
    , len
    , all;

  if (2 == arguments.length) {
    fn = keys;
    keys = event;
    event = 'keydown';
  }

  all = parseKeys(keys);
  len = all.length;

  for (var i = 0; i < len; ++i) {
    var obj = all[i];
    obj.seq = obj.seq && sequence(obj.key, fn);
    obj.event = event;
    obj.fn = fn;
    fns.push(obj);
  }

  return this;
};

/**
 * Bind keyup with `keys` and `fn`.
 *
 * @param {String} keys
 * @param {Function} fn
 * @return {k}
 * @api public
 */

exports.up = function(keys, fn){
  return this.bind('keyup', keys, fn);
};

/**
 * Bind keydown with `keys` and `fn`.
 *
 * @param {String} keys
 * @param {Function} fn
 * @return {k}
 * @api public
 */

exports.down = function(keys, fn){
  return this.bind('keydown', keys, fn);
};

/**
 * Clear all modifiers on `keyup`.
 *
 * @api private
 */

exports.clear = function(e){
  var code = e.keyCode || e.which;
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
 * @api private
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
    var key = mods.pop() || ',';

    ret.push({
      seq: !!~ key.indexOf(' '),
      code: keycode(key),
      mods: mods,
      key: key
    });
  }

  return ret;
}

/**
 * Check if the given `a` matches `b`.
 *
 * @param {Object} a
 * @param {Object} b
 * @return {Boolean}
 * @api private
 */

function matches(a, b){
  return 0 == b.mods.length || eql(a, b);
}

/**
 * Shallow eql util.
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
