const mo = new MovingObject({
    pos: [30, 30],
    vel: [10, 10],
    radius: 5,
    color: "#00FF00"
  });

  MovingObject.prototype.draw = function(ctx) {
    const canvasEl = document.getElementById("canvas");
    const ctx = canvasEl.getContext("2d");
    ctx.beginPath();
    ctx.arc(30, 30, 5, 0, 2*Math.PI, true);
    ctx.strokeStyle = "blue";
    ctx.lineWidth = 10;
    ctx.stroke();
    ctx.fillStyle = "green";
    ctx.fill();
  }

  module.exports = MovingObject;