
var dispatcher = require('k');

/**
 * keycode
 *
 * @param {String} name
 * @return {Number}
 */

function keycode(name){
  switch (name) {
    case 'command': return 91;
    case 'shift': return 16;
    case 'ctrl': return 17;
    case 'alt': return 18;
    case 'enter': return 13;
    default: return name[0].toUpperCase().charCodeAt(0);
  }
}

/**
 * keyname.
 *
 * @param {Number} code
 * @return {String}
 */

function keyname(code){
  return String.fromCharCode(code).toLowerCase();
}

/**
 * press the given `key` on `el`
 *
 * @param {Element} el
 * @param {Number|String} code
 * @return {Function}
 */

function press(el, code){
  if (!el || !code) throw new Error('(el, code) must be given to press()');
  code = keycode(code);
  var e = document.createEvent('Event');
  e.initEvent('keydown', true, true);
  e.keyCode = e.which = code;
  el.dispatchEvent(e);
  return function(){
    var e = document.createEvent('Event');
    e.initEvent('keyup', true, true);
    e.keyCode = code;
    el.dispatchEvent(e);
  };
}

/**
 * create an element.
 *
 * @param {String} type
 * @return {Element}
 */

function elem(type){
  return document.createElement(type || 'div');
}

/**
 * assert the given `expr`
 *
 * @param {Mixed} expr
 * @param {String} ms
 * @throws {Error}
 */

function assert(expr, ms){
  if (expr) return;
  throw new Error(ms || 'oh noes!');
}

describe('k', function(){

  describe('k = k(el)', function(){
    it('should create a new dispatcher with `el`', function(){
      var el = elem();
      var k = dispatcher(el);
      assert(k.el === el);
      assert(dispatcher(el) !== k);
    })
  })

  describe('k(keys, fn)', function(){
    it('should bind the given `fn` on `keys`', function(){
      var k = dispatcher(elem());
      k('shift + enter', function(){});
      k('a, b, c', function(){});
      assert('shift' == k.listeners[13][0].mods[0]);
      assert(k.listeners[keycode('a')]);
      assert(k.listeners[keycode('b')]);
      assert(k.listeners[keycode('c')]);
    })
  })

  describe('k(e)', function(){
    it('should invoke all listeners that match the event', function(){
      var el = elem();
      var k = dispatcher(el);
      var invoked = 0;
      k('enter', function(){ ++invoked; });
      k('a', function(){ ++invoked; });
      k('b', function(){ ++invoked; });
      k('c', function(){ ++invoked; });
      press(el, 'enter')();
      press(el, 'a')();
      press(el, 'b')();
      press(el, 'c')();
      assert(4 == invoked);
    })

    it('should work with modifiers like `shift + enter, ctrl + enter`', function(){
      var el = elem();
      var k = dispatcher(el);
      var invoked = 0;
      var unpress, mods = ['shift', 'ctrl', 'alt', 'command'];
      k('shift + enter', function(){ ++invoked; });
      k('ctrl + enter', function(){ ++invoked; });
      k('alt + enter', function(){ ++invoked; });
      k('command + enter', function(){ ++invoked; });
      for (var i = 0; i < mods.length; ++i) {
        unpress = press(el, mods[i]);
        press(el, 'enter')();
        assert(1 + i == invoked);
        unpress();
      }
    })

    it('should ignore input, select and textarea elements by default', function(){
      var el = elem('input');
      var k = dispatcher(el);
      var invoked = 0;
      k('enter', function(){ ++invoked; });
      k('a', function(){ ++invoked; });
      press(el, 'enter')();
      press(el, 'a')();
      assert(0 == invoked);
    })
  })

  describe('k.unbind([keys, [fn]])', function(){
    it('should unbind the given `fn` from `keys`', function(){
      var k = dispatcher(elem());
      k('shift + enter', console.log);
      k('shift + enter', console.dir);
      assert(2 == k.listeners[13].length);
      k.unbind('enter', console.dir);
      assert(1 == k.listeners[13].length);
    })

    it('should unbind all listeners if `fn` is omitted', function(){
      var k = dispatcher(elem());
      k('shift + enter', assert);
      k('shift + enter', assert);
      assert(2 == k.listeners[13].length);
      k.unbind('enter');
      assert(0 == k.listeners[13].length);
    })

    it('should reset listeners if no arguments are given', function(){
      var k = dispatcher(elem());
      k('enter', assert);
      k('a', assert);
      k('b', assert);
      assert(k.listeners[13]);
      assert(k.listeners[keycode('a')]);
      assert(k.listeners[keycode('b')]);
      k.unbind();
      assert(!k.listeners[keycode('b')]);
      assert(!k.listeners[keycode('a')]);
      assert(!k.listeners[13]);
    })
  })
})
