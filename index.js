
/**
 * dependencies.
 */

var event = require('event')
  , merge = require('merge')
  , proto = require('./proto');

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
