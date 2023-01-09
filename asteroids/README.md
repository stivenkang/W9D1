# Asteroids

In this practice, you will implement the classic game Asteroids.

## Learning Goals

- Be able to implement prototypal inheritance to give a class another class's
  methods and attributes
- Be able to include JavaScript in a web page
  - Know how Webpack works
  - Know how to test JavaScript code using `window.x = x`
- Know how to render information from JavaScript objects on a page
  - Know how to draw on a web page using Canvas

**[Live Demo][live-demo]**

[live-demo]: http://appacademy.github.io/curriculum/asteroids/index.html

## Overview

You'll decompose the Asteroids game into the following classes/sourcefiles. All
of the following will be located in the __src__ directory:

- `Util` (__src/utils.js__)
  - Utility code, especially vector math stuff.
- `MovingObject` (__src/moving_object.js__)
  - Base class for anything that moves.
  - Most important methods are `MovingObject.prototype.move`,
    `MovingObject.prototype.draw(ctx)`, and
    `MovingObject.prototype.isCollidedWith(otherMovingObject)`.
- `Asteroid` (__src/asteroid.js__)
  - Spacerock. It inherits from `MovingObject`.
- `Bullet` (__src/bullet.js__)
  - Kill spacerocks with this. Also a `MovingObject` subclass.
- `Ship` (__src/ship.js__)
  - This is you! Another `MovingObject` subclass.
- `Game` (__src/game.js__)
  - Holds collections of the asteroids, bullets, and your ship.
  - `Game.prototype.step` method calls `Game.prototype.move` on all the objects,
    and `Game.prototype.checkCollisions` checks for colliding objects.
  - `Game.prototype.draw(ctx)` draws the game.
  - Keeps track of dimensions of the space; wraps objects around when they drift
    off the screen.
- `GameView` (__src/game_view.js__)
  - Stores a `Game` instance.
  - Stores a `canvas` context to draw the game into.
  - Installs key listeners to move the ship and fire bullets.
  - Installs a timer to call `Game.prototype.step`.

## Important Note Regarding ES6

**Do not use ES6 class syntax in this project.** Understanding prototypal
inheritance is the main focus of today's project. Because ES6 class syntax
obscures how prototypal inheritance works--and has some incompatibilities with
the instructions below--avoid using it while working today. Ask your TA for a
more nuanced explanation if you need more information.

## A Refresher on Vectors

You'll use a lot of _vectors_ in this assignment.

2D vectors have an `x` and a `y` component. A position vector has an `x` and `y`
position, while a velocity vector has a speed in the `x` and the `y` directions.

### Distance

To find the "distance" between two points, the formula is:

```js
// this is math, not JavaScript
Dist([x_1, y_1], [x_2, y_2]) = sqrt((x_1 - x_2) ** 2 + (y_1 - y_2) ** 2)
```

### Norm

A vector has a _norm_, a.k.a., _magnitude_ or _length_. The norm of a
velocity vector is a speed. If `obj.vel = [3, 4]` (3 horizontal pixels and 4
vertical pixels per unit time) then the overall speed is 5 pixels per unit time.
You can easily calculate the norm of a vector using your distance function:

    Norm([x_1, y_1]) = Dist([0, 0], [x_1, y_1])

## Phase 0: __index.html__

Start by creating an __index.html__ file in your project's root directory. Your
game will run in this file.

Add `<!DOCTYPE html>` at the top of the file so your game won't load in [`quirks
mode`], then insert the `html`, `head`, and `body` tags. Provide a `title` in
the header. In the body, add a `<canvas id="game-canvas">` tag with sensible
default width and height properties. Open your __index.html__ in your browser
and use the browser's JavaScript console to test your code as you go.

[`quirks mode`]: https://developer.mozilla.org/en-US/docs/Web/HTML/Quirks_Mode_and_Standards_Mode

## Phase 1: __index.js__ (your entry point for Webpack and all your JavaScript)

As stated above, you will create classes and objects in different files; they
will need to interact with one another. When using JavaScript in the browser
there is no standard, native way to have one file require another. Webpack will
allow you to use `require` and `module.exports` syntax to import and export your
classes and objects from different files.

Let's start by installing local versions of `webpack` and `webpack-cli` in your
project. First, run `npm init -y` to create a __package.json__ and accept the
default configuration (`-y`). The presence of a __package.json__ establishes
your project as a Node.js app. Open the __package.json__ and remove the `"main"`
key-value pair. Feel free to update the `"description"` and `"author"` fields as
well.

Next, install Webpack by running `npm install -D webpack webpack-cli`. The `-D`
causes these two packages to be added to your __package.json__ as
`"devDependencies"`, meaning that they should only be installed when your app
runs in development mode. (To install packages as regular `"dependencies"` that
should always be installed, just omit the `-D`.)

To finish setting up your __package.json__, remove the `"test"` pair under
`"scripts"` and replace it with this: `"start": "webpack --watch
--mode=development"`. Your __package.json__ should now look like this:

```json
{
  "name": "asteroids",
  "version": "1.0.0",
  "description": "The classic game of Asteroids!",
  "scripts": {
    "start": "webpack --watch --mode=development"
  },
  "keywords": [],
  "author": "<Your Name>",
  "license": "ISC",
  "devDependencies": {
    "webpack": "^5.74.0",
    "webpack-cli": "^4.10.0"
  }
}
```

(Don't worry if the version numbers are a little different.)

By default, Webpack looks for a __src/index.js__ as the entry file and
designates __dist/main.js__ as the output file. In the future, you will create
more specific (and complex) configurations for Webpack, but this will work just
fine for today's project. Simply create a __src__ folder in your root directory;
it should be at the same level as the __dist__ folder. Within __src__, create an
__index.js__ file to serve as Webpack's entry point. You're all set!

Webpack takes your source files--starting with the entry point __src/index.js__,
it then includes any files __index.js__ `require`s, any files that those files
`require`, and so on--and produces a _build_ (__dist/main.js__) for the browser
to use. To create a build of your app, run `npm start` in your root directory
(i.e., the directory with the __package.json__). This command will run the
`start` script that you defined in your __package.json__: `webpack --watch
--mode=development`. Webpack will then create a development-mode build of your
app and store it in __dist/main.js__. (The `--watch` parameter tells Webpack to
update the build automatically whenever files change.)

Once you've run your webpack command, add __dist/main.js__ to the head of your
__index.html__ in a script tag. Add the `defer` attribute to ensure that the
script is loaded **after** the page contents (more on `defer` in a bit):

```html
<script type="application/javascript" src="dist/main.js" defer></script>
```

**Test:** Add a `console.log("Webpack is working!")` to your entry point file
and open your __index.html__ in the browser to make sure Webpack is running
correctly.

Finally, create a __.gitignore__ file in your root directory that includes
`node_modules/` and `dist/` inside.

Setup is complete! Go to Phase 2 to start building your asteroids (after you
**commit your code,** of course).