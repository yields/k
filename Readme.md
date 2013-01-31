
# k

  keyboard event dispatcher.

## Installation

    $ component install yields/k

## Example

```js
var k = require('k')(window);

k('shift + enter, ctrl + a', function(e){
  // do stuff fancy stuff
});
```

## API

### k = k(el)

  Create a new keyboard dispatcher on the given `element`

### k(keys, fn)

  Bind the given `fn` on `keys`.

### k.el

  the element `k` is listening on.

### k.bind(keys, fn)

  Same as `k(keys, fn)`.

### k.unbind([keys, [fn]])

  Unbind all listeners of `keys`,
  unbind `fn` with `keys`,
  unbind all listeners on all keys.

### k.destroy()

  Removes all listeners on `k.el`.
  Removes all `k.listeners`.

### k.listeners

  internal listeners.

### k.shift

  Wether or not `shift` key is currently down.

### k.ctrl

  Wether or not `ctrl` key is currently down.

### k.alt

  Wether or not `alt` key is currently down.

### k.command

  Wether or not `command` key is currently down.

## dependencies

  * [yields/keycode](/yields/keycode)
  * [component/event](/component/event)
  * [yields/merge](/yields/merge)

## Tests

```bash
$ git clone https://github.com/yields/k
$ cd k && component install && component build
$ open test/index.html
```

## License

  MIT
