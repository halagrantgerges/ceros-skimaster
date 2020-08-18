var topScore = 0;

$(document).ready(function () {
  var gameWidth = window.innerWidth;
  var gameHeight = window.innerHeight;
  var rhinoY = 0;
  var rhinoChecker = 0;
  var canvas = $("<canvas></canvas>")
    .attr("width", gameWidth * window.devicePixelRatio)
    .attr("height", gameHeight * window.devicePixelRatio)
    .css({
      width: gameWidth + "px",
      height: gameHeight + "px",
    });
  $("body").append(canvas);
  ctxManager = new CTXManager(canvas[0].getContext("2d"));
  var ctx = ctxManager.ctx;
  var skier = new Skier();

  var drawSkier = function () {

    // get skier image to be displayed 
    var skierAssetName = skier.getSkierAsset();
    var skierImage = env.loadedAssets[skierAssetName];

    // draw skier in the middle of the screen
    var x = (gameWidth - skierImage.width) / 2;
    var y = (gameHeight - skierImage.height) / 2;

    if (rhinoY > y) {
      drawRhinoAteMe();
    }
    else {
      ctxManager.drawImg(skierImage, x, y, skierImage.width, skierImage.height);
      // draw rhino after long skiying sking
      if (skier.skierDistance > 800 && rhinoY < y) {
        drawRhino();
      }
    }

    if (skier.skierDistance > topScore)
      topScore = skier.skierDistance;
    ctxManager.drawInfo(topScore, skier.skierDistance, skier.skierSpeed, gameWidth);


  };

  // draw the rhino chasing me
  function drawRhino() {
    rinhoImg = env.loadedAssets['rhinoDef'];
    var x = (gameWidth - rinhoImg.width) / 2;
    ctxManager.drawImg(rinhoImg, x, rhinoY, rinhoImg.width, rinhoImg.height);
    rhinoY = rhinoY + 2;

  }

  // draw rhino eating me
  function drawRhinoAteMe() {

    rhinoChecker++;
    rinhoImg = env.loadedAssets['rhinoAteMe' + rhinoChecker];
    var x = (gameWidth - rinhoImg.width) / 2;
    ctxManager.drawImg(rinhoImg, x, rhinoY, rinhoImg.width, rinhoImg.height);
    rhinoY = rhinoY + 2;

  }

  var drawObstacles = function () {
    var newObstacles = [];

    _.each(env.obstacles, function (obstacle) {
      var obstacleImage = env.loadedAssets[obstacle.type];
      var x = obstacle.x - skier.skierMapX - obstacleImage.width / 2;
      var y = obstacle.y - skier.skierMapY - obstacleImage.height / 2;

      if (x < -100 || x > gameWidth + 50 || y < -100 || y > gameHeight + 50) {
        return;
      }

      ctxManager.drawImg(
        obstacleImage,
        x,
        y,
        obstacleImage.width,
        obstacleImage.height
      );

      newObstacles.push(obstacle);
    });

    obstacles = newObstacles;
  };

  var placeInitialObstacles = function () {
    var numberObstacles = Math.ceil(
      _.random(5, 7) * (gameWidth / 800) * (gameHeight / 500)
    );

    var minX = -50;
    var maxX = gameWidth + 50;
    var minY = gameHeight / 2 + 100;
    var maxY = gameHeight + 50;

    for (var i = 0; i < numberObstacles; i++) {
      placeRandomObstacle(minX, maxX, minY, maxY);
    }
    env.obstacles = _.sortBy(env.obstacles, function (obstacle) {

      var obstacleImage = env.loadedAssets[obstacle.type];

      return obstacle.y + obstacleImage.height;
    });
  };

  var placeNewObstacle = function (direction) {
    var shouldPlaceObstacle = _.random(1, 8);
    if (shouldPlaceObstacle !== 8) {
      return;
    }

    var leftEdge = skier.skierMapX;
    var rightEdge = skier.skierMapX + gameWidth;
    var topEdge = skier.skierMapY;
    var bottomEdge = skier.skierMapY + gameHeight;

    switch (direction) {
      case 1: // left
        placeRandomObstacle(leftEdge - 50, leftEdge, topEdge, bottomEdge);
        break;
      case 2: // left down
        placeRandomObstacle(leftEdge - 50, leftEdge, topEdge, bottomEdge);
        placeRandomObstacle(leftEdge, rightEdge, bottomEdge, bottomEdge + 50);
        break;
      case 3: // down
        placeRandomObstacle(leftEdge, rightEdge, bottomEdge, bottomEdge + 50);
        break;
      case 4: // right down
        placeRandomObstacle(rightEdge, rightEdge + 50, topEdge, bottomEdge);
        placeRandomObstacle(leftEdge, rightEdge, bottomEdge, bottomEdge + 50);
        break;
      case 5: // right
        placeRandomObstacle(rightEdge, rightEdge + 50, topEdge, bottomEdge);
        break;
      case 6: // up
        placeRandomObstacle(leftEdge, rightEdge, topEdge - 50, topEdge);
        break;
      case 6: // jump
        placeRandomObstacle(leftEdge, rightEdge, topEdge - 50, topEdge);
        break;
    }
  };

  var placeRandomObstacle = function (minX, maxX, minY, maxY) {
    var obstacleIndex = _.random(0, env.obstacleTypes.length - 1);

    var position = calculateOpenPosition(minX, maxX, minY, maxY);

    env.obstacles.push({
      type: env.obstacleTypes[obstacleIndex],
      x: position.x,
      y: position.y,
    });
  };

  var calculateOpenPosition = function (minX, maxX, minY, maxY) {
    var x = _.random(minX, maxX);
    var y = _.random(minY, maxY);

    var foundCollision = _.find(env.obstacles, function (obstacle) {
      return (
        x > obstacle.x - 50 &&
        x < obstacle.x + 50 &&
        y > obstacle.y - 50 &&
        y < obstacle.y + 50
      );
    });
    if (foundCollision) {

      return calculateOpenPosition(minX, maxX, minY, maxY);
    } else {
      return {
        x: x,
        y: y,
      };
    }
  };

  var moveSkier = function () {

    switch (skier.skierDirection) {
      case 2:
        skier.skierMapX -= Math.round(skier.skierSpeed / 1.4142);
        skier.skierMapY += Math.round(skier.skierSpeed / 1.4142);
        skier.skierDistance++;
        placeNewObstacle(skier.skierDirection);
        break;
      case 3:
        skier.skierMapY += skier.skierSpeed;
        skier.skierDistance++;
        placeNewObstacle(skier.skierDirection);
        break;
      case 4:
        skier.skierMapX += skier.skierSpeed / 1.4142;
        skier.skierMapY += skier.skierSpeed / 1.4142;
        skier.skierDistance++;
        placeNewObstacle(skier.skierDirection);
        break;
    }

    if (skier.skierDistance != 0 && skier.skierDistance % 100 == 0)
      skier.skierSpeed++;
  };

  var gameLoop = function () {
    ctxManager.saveScaleClear(gameWidth, gameHeight);
    moveSkier();
    skier.didIHitObstacle(env.loadedAssets, env.obstacles, gameWidth, gameHeight);
    drawSkier();
    drawObstacles();
    ctxManager.restore();
    let timeOut = 0;
    // increase the timeout so that the user can see the jump
    if ((skier.skierDirection >= 7 && skier.skierDirection < 12) || (rhinoChecker > 0 && rhinoChecker < 9)) {
      timeOut = 200;
    }
    setTimeout(() => {
      // Rhino is done eating me
      if (rhinoChecker == 8) {
        // end game
        ctxManager.endGame(gameWidth, gameHeight);
        $(window).keydown(function (event) {
          // reset game after the rhino ate me
          if (event.which == 27) {
            ctxManager.resetGame(gameWidth, gameHeight);

            location.reload();
          }
        });
      } else // process games
        requestAnimationFrame(gameLoop);
    }, timeOut);
  };


  var setupKeyhandler = function () {
    $(window).keydown(function (event) {
      var direction = skier.eventHandler(event);
      if (direction != null) {
        placeNewObstacle(direction);

      }
    });
  };

  var initGame = function () {
    env = new EnvironmentAssets();
    setupKeyhandler();
    env.loadAssets().then(function () {
      placeInitialObstacles();

      requestAnimationFrame(gameLoop);
    });
  };

  initGame(gameLoop);
});
