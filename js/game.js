$(document).ready(function () {
  var gameWidth = window.innerWidth;
  var gameHeight = window.innerHeight;
  var canvas = $("<canvas></canvas>")
    .attr("width", gameWidth * window.devicePixelRatio)
    .attr("height", gameHeight * window.devicePixelRatio)
    .css({
      width: gameWidth + "px",
      height: gameHeight + "px",
    });
  $("body").append(canvas);
  var ctx = canvas[0].getContext("2d");

  var skier = new Skier();

  var clearCanvas = function () {
    ctx.clearRect(0, 0, gameWidth, gameHeight);
  };

  var drawSkier = function () {
    var skierAssetName = skier.getSkierAsset();
    var skierImage = env.loadedAssets[skierAssetName];
    var x = (gameWidth - skierImage.width) / 2;
    var y = (gameHeight - skierImage.height) / 2;

    ctx.drawImage(skierImage, x, y, skierImage.width, skierImage.height);
  };

  var drawObstacles = function () {
    var newObstacles = [];

    _.each(env.obstacles, function (obstacle) {
      var obstacleImage = env.loadedAssets[obstacle.type];
      var x = obstacle.x - skier.skierMapX - obstacleImage.width / 2;
      var y = obstacle.y - skier.skierMapY - obstacleImage.height / 2;

      if (x < -100 || x > gameWidth + 50 || y < -100 || y > gameHeight + 50) {
        return;
      }

      ctx.drawImage(
        obstacleImage,
        x,
        y,
        obstacleImage.width,
        obstacleImage.height
      );

      newObstacles.push(obstacle);
    }); ``

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

  var intersectRect = function (r1, r2) {
    return !(
      r2.left > r1.right ||
      r2.right < r1.left ||
      r2.top > r1.bottom ||
      r2.bottom < r1.top
    );
  };


  var moveSkier = function () {

    // skier.moveSkier();
    // placeNewObstacle(skier.skierDirection);
    // return;
    switch (skier.skierDirection) {
      case 2:
        skier.skierMapX -= Math.round(skier.skierSpeed / 1.4142);
        skier.skierMapY += Math.round(skier.skierSpeed / 1.4142);

        placeNewObstacle(skier.skierDirection);
        break;
      case 3:
        skier.skierMapY += skier.skierSpeed;

        placeNewObstacle(skier.skierDirection);
        break;
      case 4:
        skier.skierMapX += skier.skierSpeed / 1.4142;
        skier.skierMapY += skier.skierSpeed / 1.4142;

        placeNewObstacle(skier.skierDirection);
        break;
    }
  };

  var gameLoop = function () {
    ctx.save();

    // Retina support
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    clearCanvas();
    moveSkier();
    skier.didIHitObstacle(env.loadedAssets, env.obstacles, gameWidth, gameHeight);
    drawSkier();

    drawObstacles();

    ctx.restore();

    requestAnimationFrame(gameLoop);
  };

  var loadAssets = function () {
    var assetPromises = [];

    _.each(env.assets, function (asset, assetName) {
      var assetImage = new Image();
      var assetDeferred = new $.Deferred();

      assetImage.onload = function () {
        assetImage.width /= 2;
        assetImage.height /= 2;
        env.loadedAssets[assetName] = assetImage;

        assetDeferred.resolve();
      };
      assetImage.src = asset;

      assetPromises.push(assetDeferred.promise());
    });

    return $.when.apply($, assetPromises);
  };

  var setupKeyhandler = function () {
    $(window).keydown(function (event) {
      var x = skier.eventHandler(event);
      if (x != null) {
        placeNewObstacle(x);

      }
    });
  };

  var initGame = function () {
    env = new EnvironmentAssets();
    setupKeyhandler();
    loadAssets().then(function () {
      placeInitialObstacles();

      requestAnimationFrame(gameLoop);
    });
  };

  initGame(gameLoop);
});
