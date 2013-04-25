# k

  keyboard event dispatcher.

## Installation

    $ component install yields/k

## Example

```js
var k = require('k')(window);

k('shift + enter, ctrl + a', function(e){
  // fancy stuff over here.
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

### k.ignore(e)

  this function is called just before any handlers are called,
  if it returns `true` no handlers will be called for this event.

  by default it returns `true` for `input`, `textarea` or `select`.

### k.listeners

  internal listeners.

### k.shift

  Whether or not `shift` key is currently down.

### k.ctrl

  Whether or not `ctrl` key is currently down.

### k.alt

  Whether or not `alt` key is currently down.

### k.command

  Whether or not `command` key is currently down.

## dependencies

  * [yields/keycode](https://github.com/yields/keycode)
  * [component/event](https://github.com/component/event)
  * [yields/merge](https://github.com/yields/merge)

## Tests

```bash
$ git clone https://github.com/yields/k
$ cd k && component install && component build
$ open test/index.html
```

## License

  MIT
