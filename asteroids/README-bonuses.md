# Asteroids, Bonuses

In these bonus phases, you will add a picture background to your game (Bonus 1)
and use `requestAnimationFrame` to improve the animation (Bonus 2).

## Bonus 1: Drawing an image

Oftentimes people want to draw a background image on their game.

```javascript
const img = new Image();
img.onload = function() {
  ctx.drawImage(img, xOffset, yOffset);
};
img.src = "myImage.png";
```

Note you may have to redraw the background for each iteration. You do not need
to constantly reload the `img`; just make sure to `ctx.drawImage` each frame.

## Bonus 2: `requestAnimationFrame`

You are going to have your game use `requestAnimationFrame`. Go to the console
and type this in. Notice that it is in the global namespace. It provides a
better way to do animations. Read more [here][requestAnimationFrame].

### MovingObject

Rewrite your `move` method, this time allowing it to take in a `timeDelta`.
Increment the `pos` by the `vel * delta`. The delta will be created in the
GameView's `animate` method based on the time variable provided by
`window.requestAnimationFrame`. Until you define that method, default `delta` to
a value of 1. You can default a value using the logical OR operator:
`delta = delta || 1`.

### Game

Refactor your `Game.prototype.moveObjects(delta)` method. It should pass the
`delta` to each `Asteroid.prototype.move`.

### GameView

The `GameView` should now store a `lastTime` instance variable. It will be used
to derive the delta (default it to `0`).

Write a `GameView.prototype.animate` method. It should:

- Create a `delta` variable. It represents the difference between the last time
  `animate` was called and the current call to `animate`. The current time will
  be passed to the animate function as a parameter.

- Call `requestAnimationFrame`, passing in the `GameView.prototype.animate`.
  Yes, this is recursive. Each frame calls the next.

- Call `Game.prototype.moveObjects(delta)` and `Game.prototype.draw(ctx)`

- Update `this.lastTime` to be equal to the current time;

Refactor your `GameView.prototype.start` method. It will make the first call to
`requestAnimationFrame`, passing in the `GameView.prototype.animate`.

**N.B.:** You'll notice that all of your moving objects are moving way too fast.
Go back to `MovingObject.prototype.move` and divide the delta by some number
before adding it to the velocity. Your code might look something like this:

```js
const velX = this.vel[0] * (delta / 20);
const velY = this.vel[1] * (delta / 20);

this.pos = [this.pos[0] + velX, this.pos[1] + velY];
```

## Resources

- [Canvas tutorial](https://developer.mozilla.org/en-US/docs/HTML/Canvas/Tutorial)
- [Canvas docs](https://developer.mozilla.org/en-US/docs/HTML/Canvas)

[requestAnimationFrame]: https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame