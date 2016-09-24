// --------------------------------------------------
// SNAKE
// --------------------------------------------------
var snake = (function() {
  var snakeCanvas = querySelector('#s');
  var snakeContext = snakeCanvas.getContext('2d');

  var SNAKE_SIZE = 5;
  var START_LENGTH = 4;
  var START_X = 100;
  var START_Y = 20;
  var COLOR = '#fff';

  snakeContext.fillStyle = COLOR;

  var snake, pellet;
  var counter = 0;
  var pelletPos = [
    {x: 40, y: 50},
    {x: 100, y: 100},
    {x: 20, y: 20},
    {x: 30, y: 75},
    {x: 90, y: 5},
    {x: 70, y: 5},
    {x: 70, y: 25},
    {x: 100, y: 25}
  ];

  function reset() {
    pelletIndex = 1;

    snake = sprite({
      x: START_X,
      y: 20,
      width: SNAKE_SIZE * START_LENGTH,
      height: SNAKE_SIZE,
      color: COLOR,
      context: snakeContext,
      length: START_LENGTH,
      body: [],
      dead: false,
      update: function() {
        if (!this.dead) {
          if (pellet.x < this.x) {
            this.x -= SNAKE_SIZE;
          }
          else if (pellet.x > this.x) {
            this.x += SNAKE_SIZE;
          }
          else {
            if (pellet.y < this.y) {
              this.y -= SNAKE_SIZE;
            }
            else if (pellet.y > this.y) {
              this.y += SNAKE_SIZE;
            }
          }

          // snake eat a pellet
          if (this.x === pellet.x && this.y == pellet.y) {
            pellet.x = pelletPos[pelletIndex].x;
            pellet.y = pelletPos[pelletIndex].y;

            pelletIndex++;

            this.length += 2;
          }

          // snake ran into itself
          for (var i = 0, pos; (pos = snake.body[i]); i++) {
            if (snake.x === pos.x && snake.y === pos.y) {
              this.dead = true;
              return;
            }
          }

          // update snake body positions
          this.body.unshift({x: this.x, y: this.y});

          if (this.body.length > this.length) {
            this.body.pop();
          }
        }
      },
      render: function() {
        for (var i = 0, pos; (pos = this.body[i]); i++) {
          snakeContext.fillRect(pos.x, pos.y, SNAKE_SIZE, SNAKE_SIZE);
        }
      }
    });

    // initialize snake body
    for (var i = 0; i < START_LENGTH; i++) {
      snake.body[i] = {x: START_X + (i * SNAKE_SIZE), y: START_Y};
    }

    pellet = sprite({
      x: pelletPos[0].x,
      y: pelletPos[0].y,
      render: function() {
        snakeContext.beginPath();
        snakeContext.arc(this.x + 2.5, this.y + 2.5, 2.5, 0, 2 * Math.PI);
        snakeContext.fill();
      }
    });
  }

  reset();

  // loop
  return {
    update: function(dt) {
      counter += dt;

      // slow down the snake fps
      if (counter > 1 / 15) {
        snake.update();
        counter -= 1 / 15;
      }
    },
    render: function() {
      snakeContext.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      snake.render();
      pellet.render();
    },
    reset: reset
  };
})();