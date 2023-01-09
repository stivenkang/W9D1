# Asteroids, Phase 2: `MovingObject` and `Asteroid`

In Phase 2, you will implement the base `MovingObject` class and its first
derived class, `Asteroid`.

## `MovingObject`

Write a `MovingObject` class in __src/moving_object.js__.

Store key instance variables:

- 2D `pos`ition
- 2D `vel`ocity
- `radius` (everything in the game is a circle)
- `color`

Rather than pass all these as separate arguments, write your `MovingObject`
constructor function so that you can pass in a single options object:

```js
const mo = new MovingObject({
  pos: [30, 30],
  vel: [10, 10],
  radius: 5,
  color: "#00FF00"
});
```

(This is a common pattern that you will see frequently moving forward.)

**Test:** Verify that your `MovingObject` constructor works as expected. To
access your `MovingObject` constructor in your browser's console, you will need
to first export it using `module.exports`, then require __moving_object.js__ in
your entry file, then declare the constructor function on the window. Look at
the snippets below as a guide. Make sure you can create a `MovingObject` in your
console!

```js
// moving_object.js
function MovingObject() {
  // your code
}

module.exports = MovingObject;
```

```js
// index.js
const MovingObject = require("./moving_object.js");

window.MovingObject = MovingObject;
```

Next, write a `MovingObject.prototype.draw(ctx)` method. Draw a circle of the
appropriate `radius` centered at `pos`. Fill it with the appropriate `color`.
Refer to the Drunken Circles demo if you need a refresher on Canvas.

In __index.js__, use `document.getElementById()` to find the canvas element.
Call `getContext` on the canvas element with `"2d"` as the argument to extract a
canvas context.

**Test:** Make sure you can draw a `MovingObject`.

Write a `MovingObject.prototype.move` method. Increment the `pos` by the `vel`.

### Deepen your understanding: Loading scripts

Load your __index.html__ in the browser and open the DevTools. Your game doesn't
do much yet, but it should at least load without complaining. Now go to
__index.html__, remove the `defer` from your `script` tag, and reload the page
in your browser. Your browser console should now show an error like this:

```plaintext
Uncaught TypeError: canvasEl is null
```

Why do you get this error? When the `script` tag tries to execute the code from
your __index.js__, the `getElementById` cannot find your `game-canvas` element
because **that element has not yet been loaded onto the page;** the `script` tag
comes before the `canvas` tag in __index.html__.

To fix the problem, you could move the `script` tag below the `canvas` tag in
the body, but, by convention, scripts belong in the header. You could also pass
the code in __index.js__ as a callback to a [`DOMContentLoaded`] event listener
in __index.js__, the standard approach in older codebases. This event listener
would ensure that the code in the callback was not executed until the entire
page had finished loading.

Today, however, you will implement a third solution, which you already know: add
the `defer` back to the `script` tag in __index.html__. `defer` tells the
browser not to load this script until the rest of the page has loaded, which is
exactly what you want. Refresh your browser and watch the error disappear!

[`DOMContentLoaded`]: https://developer.mozilla.org/en-US/docs/Web/Events/DOMContentLoaded#Example

## Util

You want your classes to inherit from one another. You could monkey-patch
`Function` to add an `inherits` method:

```js
Function.prototype.inherits = function (ParentClass) { ... };
```

Monkey-patching, however, can cause problems and should be done judiciously.
Instead, create a general utilities module in __src/util.js__ and add your
first utility function:

```js
Util.inherits = function (childClass, parentClass) { ... }
```

**Note:** You should export a POJO (plain old JavaScript object) from Util, not
a class or constructor function. You don't need to create instances of `Util`.

```js
const Util = {
  inherits(childClass, parentClass) {
    //...
  }
};

module.exports = Util;
```

The code below achieves the same effect as the code above but is written with
clearer ES6 syntax:

```js
const Util = {
  inherits: function inherits(childClass, parentClass) {
    //...
  }
};

module.exports = Util;
```

### Asteroid

Write an `Asteroid` class in a __src/asteroid.js__ file. This should inherit
from `MovingObject`.

Pick a default `COLOR` and `RADIUS` for `Asteroid`s. Set these as properties of
the `Asteroid` class: `Asteroid.COLOR` and `Asteroid.RADIUS`.

Write your `Asteroid` constructor so that the caller specifies the `pos` and
calls the `MovingObject` constructor, setting `color` and `radius` to the
`Asteroid` defaults, and choosing a random vector for `vel`. Use the following
helper functions from the Util object to help you create a random vector.

```js
// Return a randomly oriented vector with the given length.
const Util = {
  randomVec(length) {
    const deg = 2 * Math.PI * Math.random();
    return Util.scale([Math.sin(deg), Math.cos(deg)], length);
  },
  // Scale the length of a vector by the given amount.
  scale(vec, m) {
    return [vec[0] * m, vec[1] * m];
  }
};
```

```js
// Other properties are filled in for you.
new Asteroid({ pos: [30, 30] });
```

Why do you still need to call `MovingObject`'s constructor function from within
`Asteroid`'s constructor function?

Your `inherits` function sets up the prototype inheritance chain, which makes
methods available on the parent's prototype available to instances of the child
class. However, you still need to call `MovingObject`'s constructor function
from within `Asteroid`'s constructor function to access the code that sets
properties such as `this.pos` and `this.vel`. It's the equivalent to calling
`super` in a class's `#initialize` method in Ruby.

**Note:** Invoking an ES2015 class constructor without `new` (such as
`MovingObject` with `call()`) throws an error. Hence the need to use ES5 syntax
for this project.

**Test:** Make sure you can create and draw an Asteroid.

### Game

`Game` will be in charge of holding all of your moving objects. It will also
contain the logic for iterating through these objects and calling their
corresponding `move` methods.

Write a `Game` class in __src/game.js__. Define the following constants on the
`Game` class: `DIM_X`, `DIM_Y`, and `NUM_ASTEROIDS`.

Write a `Game.prototype.addAsteroids` method. Randomly place the asteroids
within the dimensions of the game grid. You may also wish to write a
`Game.prototype.randomPosition` method. Store the asteroids as a property of
your game instance in an array `asteroids`. Call `addAsteroids` in your
constructor.

Write a `Game.prototype.draw(ctx)` method. It should call `clearRect` on the
`ctx` to wipe down the entire space. Call the `draw` method on each of the
`asteroids`.

Write a `Game.prototype.moveObjects` method. It should call `move` on each of
the `asteroids`.

### GameView

Your `GameView` class will be responsible for keeping track of the canvas
context, the game, and the ship. Your `GameView` will be in charge of setting an
interval to animate your game. In addition, it will eventually bind key handlers
to the ship so that you can move it around.

Define a `GameView` class in __src/game_view.js__. The `GameView` should store a
`Game` and take in and store a drawing `ctx`.

Write a `GameView.prototype.start` method. It should call `setInterval` to call
`Game.prototype.moveObjects` and `Game.prototype.draw` once every 20ms or so.

### Back to your entry file

Once you have your `GameView` set up, construct a `GameView` object and call
`GameView.prototype.start` in __index.js__.

While you're in __index.js__, also use `Game`'s `DIM_X` and `DIM_Y` constants to
set the height and width of your canvas element. You can then remove the height
and width attributes from your `canvas` tag in __index.html__. This will make it
easy to adjust your canvas size: you just have to change your `Game` constants!

**Note:** Make sure you set the `height` and `width` properties directly on the
canvas element. **Do not try to change the size through CSS `height` and `width`
properties.** CSS properties do not change the actual canvas size. Instead, they
will scale the currently-sized canvas to the specified dimensions, which
distorts the view and makes it hard to place/track objects accurately.

If your Webpack is watching, it should update the build with these changes. Make
sure everything is working properly.

Once your asteroids are flying around the canvas, go ahead and **commit your
code.** In Phase 3, you will finish your asteroids by allowing them to wrap and
collide.