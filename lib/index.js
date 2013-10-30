
/**
 * dependencies.
 */

var event = require('event')
  , proto = require('./proto')
  , bind = require('bind');

/**
 * Create a new dispatcher with `el`.
 *
 * example:
 *
 *      var k = require('k')(window);
 *      k('shift + tab', function(){});
 *
 * @param {Element} el
 * @return {Function}
 * @api public
 */

module.exports = function(el){
  function k(e, fn){ k.handle(e, fn) };
  k._handle = bind(k, proto.handle);
  k._clear = bind(k, proto.clear);
  event.bind(el, 'keydown', k._handle, false);
  event.bind(el, 'keyup', k._handle, false);
  event.bind(el, 'keyup', k._clear, false);
  event.bind(el, 'focus', k._clear, false);
  for (var p in proto) k[p] = proto[p];
  k.listeners = [];
  k.el = el;
  return k;
};
