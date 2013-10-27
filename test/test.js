
describe('k', function(){

  var keycode = require('keycode')
    , assert = require('assert')
    , dispatcher = require('k')
    , os = require('os');

  // superkey

  var superkey = 'mac' == os
    ? 'command'
    : 'ctrl';

  describe('(element)', function(){
    it('should create a new dispatcher with `el`', function(){
      var el = elem();
      var k = dispatcher(el);
      assert(k.el === el);
      assert(dispatcher(el) !== k);
    })
  })

  describe('(keys, fn)', function(){
    it('should bind the given `fn` on `keys`', function(){
      var k = dispatcher(elem());
      k('shift + enter', function(){});
      k('a, b, c', function(){});
      assert('shift' == k.listeners[13][0].mods[0]);
      assert(k.listeners[keycode('a')]);
      assert(k.listeners[keycode('b')]);
      assert(k.listeners[keycode('c')]);
    })

    it('should support bind `,` key currectly', function(){
      var k = dispatcher(elem());
      k(',', function(){});
      assert(k.listeners[keycode(',')]);
    })

    it('should support keys like `command + ,, ctrl + ,`', function(){
      var k = dispatcher(elem());
      k('ctrl + ,, command + ,', function(){});
      assert(2 == k.listeners[keycode(',')].length)
      assert('ctrl' == k.listeners[keycode(',')][0].mods[0]);
      assert('command' == k.listeners[keycode(',')][1].mods[0]);
    })

    it('should support multiple modifers `command + shift + ,`', function(){
      var k = dispatcher(elem());
      k('command + shift + ,', function(){});
      assert(2 == k.listeners[keycode(',')][0].mods.length);
    })
  })

  describe('("super + enter", fn)', function(){
    it('should be invoked on "' + superkey + ' + enter"', function(){
      var el = elem();
      var k = dispatcher(el);
      var invoked = 0;
      k('super + enter', function(){ ++invoked; });
      var sup = press(el, superkey);
      var enter = press(el, 'enter');
      assert(1 == invoked);
      sup();
      enter();
    })

    it('should set "' + superkey + '" and .super to true when super is down', function(){
      var el = elem();
      var k = dispatcher(el);
      var invoked = 0;
      k('super + enter', function(){ ++invoked; });
      var sup = press(el, superkey);
      assert(k[superkey]);
      assert(k.super);
      sup();
    })
  })

 describe('(event)', function(){
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

    it('should invoke keys like `ctrl + ,, command + ,` and `,`', function(){
      var el = elem();
      var k = dispatcher(el);
      var invoked = 0;
      function incr(){ ++invoked; }
      k(',', incr);
      k('ctrl + ,, command + ,', incr);
      press(el, ',')();
      assert(1 == invoked);
      var unpress = press(el, 'ctrl');
      press(el, ',')();
      unpress();
      assert(3 == invoked);
      unpress = press(el, 'command');
      press(el, ',')();
      unpress();
      assert(5 == invoked);
    })

    it('should work with multiple modifers `command + shift + ,`', function(){
      var el = elem();
      var k = dispatcher(el);
      var invoked = 0;
      function incr(){ ++invoked; }
      k('command + shift + ,', incr);
      press(el, 'command');
      assert(0 == invoked);
      press(el, 'shift');
      assert(0 == invoked);
      press(el, ',');
      assert(1 == invoked);
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

    it('should set `.MODIFIER` to `true` when its down', function(){
      var el = elem();
      var k = dispatcher(el);
      var mods = ['ctrl', 'shift', 'command', 'alt'];
      var unpress;
      for (var i = 0; i < mods.length; ++i) {
        unpress = press(el, mods[i]);
        assert(true == k[mods[i]]);
        unpress();
        assert(null == k[mods[i]])
      }
    })

    it('should not clear all modifiers onkeyup unless they are not down', function(){
      var el = elem();
      var k = dispatcher(el);
      var mods = ['ctrl', 'shift', 'command', 'alt'];
      var unpress;
      for (var i = 0; i < mods.length; ++i) {
        unpress = press(el, mods[i]);
        press(el, 'enter')();
        assert(true == k[mods[i]]);
        unpress();
        assert(null == k[mods[i]]);
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

  describe('#super', function(){
    it('should be "' + superkey + '" on "' + os + '"', function(){
      assert(superkey == dispatcher(window).super);
    })
  })

  describe('#unbind', function(){
    it('("shift + enter", fn)', function(){
      var k = dispatcher(elem());
      k('shift + enter', console.log);
      k('shift + enter', console.dir);
      assert(2 == k.listeners[13].length);
      k.unbind('enter', console.dir);
      assert(1 == k.listeners[13].length);

      k('shift + 1', console.warn);
      assert(1 == k.listeners[49].length);
      k.unbind('shift + 1', console.warn);
      assert(0 == k.listeners[49].length);
    })

    it('("command + enter")', function(){
      var k = dispatcher(elem());
      k('command + enter', assert);
      k('shift + enter', assert);
      assert(2 == k.listeners[13].length);
      k.unbind('command + enter');
      assert(1 == k.listeners[13].length);
    })

    it('("enter")', function(){
      var k = dispatcher(elem());
      k('shift + enter', assert);
      k('shift + enter', assert);
      assert(2 == k.listeners[13].length);
      k.unbind('enter');
      assert(0 == k.listeners[13].length);
    })

    it('("left, right")', function(){
      var k = dispatcher(elem());
      k('left', assert);
      k('right', assert);
      assert(1 == k.listeners[keycode('left')].length);
      assert(1 == k.listeners[keycode('right')].length);
      k.unbind('left, right');
      assert(0 == k.listeners[keycode('left')].length);
      assert(0 == k.listeners[keycode('right')].length);
    })

    it('()', function(){
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

  describe('#modifiers', function(){
    it('should be `true` if a modifier(s) is down', function(){
      var el = elem();
      var k = dispatcher(el);
      var mods = ['ctrl', 'shift', 'command', 'alt'];
      var unpress;
      for (var i = 0; i < mods.length; ++i) {
        unpress = press(el, mods[i]);
        assert(true == k.modifiers);
        unpress();
        assert(null == k.modifiers);
      }
    })

    it('should be `falsey` if no modifiers are down', function(){
      var el = elem();
      var k = dispatcher(el);
      assert(null == k.modifiers);
      var shift = press(el, 'shift');
      var ctrl = press(el, 'ctrl');
      assert(true == k.modifiers);
      shift();
      assert(true == k.modifiers);
      ctrl();
      assert(null == k.modifiers);
    })
  })

  // press `el` with `code`

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

  // create element with `type`

  function elem(type){
    return document.createElement(type || 'div');
  }
})
