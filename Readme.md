# k

  keyboard event dispatcher.

## Installation

    $ component install yields/k

## Features

  - `super` keyword is `command` on mac and `ctrl` on anything else.
  - gmail like sequences `(a b c *)`
  - key combos
  - nice simple api
  - you can unbind anything you bind

## Example

```js
var k = require('k')(window);

// combos
k('command + shift + enter', fn);

// on OSX `super` will be replaced with `command`
// on other operating systems it will be replaced with `ctrl`.
k('super + k', fn);

// sequences
k('a b c', fn);
k('* b c', fn);
k('super + shift + a b c', fn);
```

## API

### k(el)

  Create a new keyboard dispatcher on the given `element`

### k(keys, fn)

  Bind the given `fn` on `keys`.

### .el

  the element `k` is listening on.

### #bind

  Bind `keys` with `fn(e)`.

### #unbind

  Unbind all listeners of `keys`,
  unbind `fn` with `keys`,
  unbind all listeners on all keys.

```js
k.unbind(); // => unbind all listeners
k.unbind('enter'); // => unbind all enter listeners
k.unbind('command + enter'); // => unbind all `command + enter` listeners
k.unbind('command + enter', fn); // => unbind `fn` just from `command + enter`
```

### #destroy

  Removes all listeners on `k.el`.
  Removes all `k.listeners`.

### #ignore

  this function is called just before any handlers are called,
  if it returns `true` no handlers will be called for this event.

  by default it returns `true` for `input`, `textarea` or `select`.

  if you still want `k` to handle `inputs` you can `k.ignore = false`.

### .shift

  `true` if `shiftKey` is down.

### .ctrl

  `true` if `ctrlKey` is down.

### .alt

  `true` if `alt` is down.

### .command

  `true` if `command` is down.

### .modifiers

  `null` if no modifiers are down, otherwise it's `true`.

### .super

  `true` if `command` or `ctrl` are down (osx / others)

## Tests

```bash
$ make test
```

## License

  MIT
