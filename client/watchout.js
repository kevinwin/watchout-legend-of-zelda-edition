// start slingin' some d3 here.

// Variables
var prevCollision = false;
var width = window.innerWidth;
var height = window.innerHeight;
var numEnemies = 5;
var enemySize = 70;
var playerSize = 50;
var collisionCount = 0;
var currentScore = 0;
var highScore = 0;

// canvas
var svg = d3.select('.container').append('svg')
  .attr('width', width)
  .attr('height', height)
  .style('background-color', '#272727');

// body margin reset
var body = d3.select('body').style('margin', 0);

// scoreboard
var scoreboard = d3.select('.scoreboard')
  .style({
    'padding': '10px',
    'position': 'absolute',
    'top': '40px',
    'right': '40px',
    'background': '#ddd',
    'text-align': 'right',
    'border-radius': '3px',
    'font-family': '"Helvetica Neue", Helvetica, Arial, sans-serif',
    'line-height': '27px',
    'font-size': '18px',
    'font-weight': 'bold',
    'opacity': '0.5',
    'color': '#333333'
  });

// generates an array with just enough data
// to bind to enemy DOM nodes
var data = (function() {
  var data = [];
  for (var i = 0; i < numEnemies; i++) {
    data.push(i);
  }
  return data;
})();

var randX = function() {
  return Math.random() * width;
};
var randY = function() {
  return Math.random() * height;
};

// Initalizes enemies
var enemies = svg.selectAll('image')
  .data(data)
  .enter().append('image')
  .attr('xlink:href', 'moblin.png')
  .attr('width', enemySize)
  .attr('height', enemySize)
  .attr('class', 'enemy')
  .attr('x', randX)
  .attr('y', randY);

// Set up drag functionality
var drag = d3.behavior.drag()
  .on('drag', function() {
    d3.select('.player')
      .attr('x', d3.event.x - (playerSize / 2))
      .attr('y', d3.event.y - (playerSize / 2));
  });
// initialize the player
var player = svg.append('svg:image')
  .attr('xlink:href', 'link.svg')
  .attr('class', 'player')
  .attr('width', playerSize)
  .attr('height', playerSize)
  .attr('x', width / 2)
  .attr('y', height / 2)
  .call(drag);

// IIFE for enemy movement
var move = (function move(elements) {
  elements.transition()
    .duration(1000)
    .delay(500)
    .ease('linear')
    .attr('x', randX)
    .attr('y', randY)
    .each('end', function() {
      move(elements);
    });
})(enemies);

var detectCollisions = function() {
  var collided = false;
  // calculate distance across all enemies
  enemies.each(function() {
    var enemy = d3.select(this);
    var enemyX = enemy.attr('x');
    var playerX = player.attr('x');
    var enemyY = enemy.attr('y');
    var playerY = player.attr('y');
    var distance = Math.sqrt(Math.pow(enemyX - playerX, 2) + Math.pow(enemyY - playerY, 2));

    if (distance < enemySize) { collided = true; }
  });

  // Collision!!
  if (collided && collided !== prevCollision) {
    collisionCount++;
    d3.select('.collisions span').text(collisionCount);

    svg.style('background-color', 'red')
      .transition()
      .duration(100)
      .style('background-color', '#272727');

    if (currentScore > highScore) {
      highScore = d3.select('.current span').text();
      d3.select('.highscore span').text(highScore);
    }

    // reset current score to 0
    currentScore = 0;
    d3.select('.current span').text(currentScore);

  }
  prevCollision = collided;
};

var incrementScore = function() {
  currentScore++;
  d3.select('.current span').text(currentScore);


};



d3.timer(function() {
  incrementScore();
  detectCollisions();
});