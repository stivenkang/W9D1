# Asteroids, Phases 3-5

In Phases 3-5, you will handle wrapping and colliding asteroids (Phase 3), build
your ship (Phase 4), and enable the ship to fire bullets (Phase 5). Once you
finish Phase 5, you will have a working game!

## Phase 3: Wrapping and colliding asteroids

Currently your asteroids slide off the screen. You'd like to keep everything
within the dimensions of the game's rectangular view by mapping opposite sides
of the grid view. If an asteroid scrolls off one side, it should reappear on the
other. Write a `Game.prototype.wrap(pos)` method, which takes a `pos` in and
returns a "wrapped position".

Next, change your calls of `new Asteroid` to pass in the `game` as one of the
`options`. In `MovingObject`, store the `game`. Update your
`MovingObject.prototype.move` method to call `Game.prototype.wrap` on `this.pos`
each time.

Check that your `Asteroid`s don't all fly away, but instead, wrap like they are
supposed to.

### Colliding asteroids

A big part of Asteroids is the collision of objects: ships collide with
asteroids, bullets collide with asteroids, and asteroids collide with other
asteroids. To start, let's implement asteroids colliding with asteroids.

Write a `MovingObject.prototype.isCollidedWith(otherObject)` method. Two circles
have collided if the distance between their center points is less than the sum
of their radii.

Next, write a `Game.prototype.checkCollisions` that iterates through the
asteroids and `alert("COLLISION");` whenever two collide. Make sure not to check
if an asteroid collides with itself.

Write a `Game.prototype.step` method, which calls `Game.prototype.moveObjects`
then `Game.prototype.checkCollisions`. Call this in `GameView.prototype.start`
instead of `moveObjects` directly.

**Check your work**. This shouldn't be too hard if you reduce
`Game.NUM_ASTEROIDS = 4` or so.

Lastly: when an asteroid crashes into another, let's remove both asteroids.
Write `Game.prototype.remove(asteroid)` and
`MovingObject.prototype.collideWith(otherObject)`. In
`MovingObject.prototype.collideWith(otherObject)`, call `Game.prototype.remove`
on both objects.

You'll change this soon, but you want to have collision and removal logic
working. **Check that when two asteroids collide, they both go away**.

## Phase 4: `Ship`

In __src/ship.js__, write a `Ship` class; this should be another subclass of
`MovingObject`. Define `Ship.RADIUS` and `Ship.COLOR` as before. Initialize the
`vel` to the zero vector.

In your `Game` constructor, build a `Ship` object. Use
`Game.prototype.randomPosition` to place the `Ship`. Save your ship to an
instance variable.

Write a `Game.prototype.allObjects` method that returned the array of
`Asteroid`s + the ship. Iterate through this in `Game.prototype.draw`,
`Game.prototype.moveObjects`, and `Game.prototype.checkCollisions`.

Update the `MovingObject.prototype.collideWith(otherObject)` logic. Stop
removing colliding asteroids; your `MovingObject.prototype.collideWith` should
be empty. Instead, overwrite the superclass's method with
`Asteroid.prototype.collideWith(otherObject)`: if `otherObject instanceof Ship`,
call `Ship.prototype.relocate`. The `Ship.prototype.relocate` method should
reset the `Ship`'s position to `game.randomPosition()` and reset the velocity to
the zero vector.

### Moving the ship

Add a `Ship.prototype.power(impulse)`. The impulse should be added to the
current velocity of the ship.

Add a `GameView.prototype.bindKeyHandlers` method. Check out the [`keymaster`]
library. Download __keymaster.js__ to a __vendor__ folder in your root directory
and use a `script src` tag to require it above your __main.js__ file. The
`keymaster` library will expose a global method `key` which takes a key and a
callback that will be triggered when the key is pressed. Use it to bind keys to
call `Ship.prototype.power` on the game's `ship`. Call your `bindKeyHandlers`
method in `GameView.prototype.start`.

[`keymaster`]: https://github.com/madrobby/keymaster

## Phase 5: Firing `Bullet`s

Write a `Bullet` subclass of `MovingObject`. The idea is that when a `Bullet`
collides with an `Asteroid`, you'll remove the `Asteroid` from the `Game`.

The key is `Ship.prototype.fireBullet`. This should:

1. Construct a new `Bullet` instance.
2. Use the `Ship`s `vel` as the bullet's direction of travel.
3. Add the bullet to an array of `Game` bullets.

`Game` should store an array of `Bullet`s just like `Asteroid`s. To make your
life easier, write a `Game.prototype.add(obj)` method that adds to
`this.asteroids`/`this.bullets` if `obj instanceof Asteroid`/`obj instanceof
Bullet`. Write a similar `Game.prototype.remove(obj)` method. This will be
easier than having two methods each for `Asteroid` and `Bullet`.

Update your `Game.prototype.allObjects` as well.

Update `GameView.prototype.addKeyBindings` to bind a key to
`Ship.prototype.fireBullet`.

### Cleaning up objects

Your `Bullet` should not wrap like other objects. When it leaves the visible
grid, it should be removed.

Write a `Game.prototype.isOutOfBounds(pos)` to return `true` if an object slips
off screen.

Define a property `MovingObject.prototype.isWrappable = true`. However, you can
overwrite this in `Bullet` to be false.

In `MovingObject.prototype.move`, after updating the position, check if the
object is out of bounds. If so, either (A) wrap the object if it `isWrappable`
or (B) call `Game.prototype.remove` if not.

Great job! You now have a fully functional Asteroids game! **Commit your code**,
then head over to the bonuses for some extra bells and whistles.