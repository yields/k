
0.7.0 / 2014-12-01
==================

  * modifiers: consider inactive modifiers
  * sequences: support cmd + *
  * package: add "repository" field
  * package: rename to "yields-k" for npm
  * component: add "browser" keyword

0.6.2 / 2014-05-19
==================

 * fix for older browsers and reserved keywords (<IE9)

0.6.1 / 2014-03-03
==================

 * fix for firefox keycode, closes #21

0.6.0 / 2013-10-30
==================

 * add gmail like sequences, closes #17
 * add keyup support, closes #11
 * use array for listeners

0.5.2 / 2013-10-27
==================

 * fix bug when unbinding multiple listeners [karlbohlmark]

0.5.1 / 2013-10-10
==================

 * fix unbind("mod + key")

0.5.0 / 2013-09-28
==================

 * refactor
 * Better `.unbind()` [dandean]

0.4.1 / 2013-09-28
==================

 * fix .unbind(keys, fn), closes #13

0.4.0 / 2013-09-16
==================

 * add package.json
 * remove "merge" dep
 * add "super" support, closes #6
 * add multiple modifiers support

0.3.0 / 2013-08-16
==================

 * clean unbind
 * typo: break, instead of continue

0.2.1 / 2013-06-08
==================

 * add ie7-9 support
 * left command keycode is 93 [lepture]

0.2.0 / 2013-04-28
==================

  * add comma support
  * add .modifiers, closes #3

0.1.3 / 2013-04-28
==================

  * fix modifier clearing, closes #4

0.1.2 / 2013-04-27
==================

  * remove global keycode() from tests

0.1.1 / 2013-04-27
==================

  * keycode dep
  * keycode dep fix [lepture]

0.1.0 / 2013-04-25
==================

  * ignore keypress on input, select and textarea
  * move proto to ./proto.js

0.0.1 / 2013-01-31
==================

  * readme typo
  * initial commit
