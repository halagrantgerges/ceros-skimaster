var topScore = 0;

$(document).ready(function () {


  var gameWidth = window.innerWidth;
  var gameHeight = window.innerHeight;
  var gamedPaused = false;
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

  var moveSkier = function () {

    switch (skier.skierDirection) {
      case 2:
        skier.skierMapX -= Math.round(skier.skierSpeed / 1.4142);
        skier.skierMapY += Math.round(skier.skierSpeed / 1.4142);
        skier.skierDistance++;
        obst.placeNewObstacle(skier);
        break;
      case 3:
        skier.skierMapY += skier.skierSpeed;
        skier.skierDistance++;
        obst.placeNewObstacle(skier);
        break;
      case 4:
        skier.skierMapX += skier.skierSpeed / 1.4142;
        skier.skierMapY += skier.skierSpeed / 1.4142;
        skier.skierDistance++;
        obst.placeNewObstacle(skier);
        break;
    }

    if (skier.skierDistance != 0 && skier.skierDistance % 100 == 0)
      skier.skierSpeed++;
  };

  var gameLoop = function () {
    $(window).keydown(function (event) {
      if (event.which == 38) {
        gamedPaused = true;
      }
      if (event.which == 40 || event.which == 39 || event.which == 37) {
        gamedPaused = false;
      }
    });

    if (!gamedPaused) {
      // proccess game
      ctxManager.saveScaleClear(gameWidth, gameHeight);
      moveSkier();
      skier.didIHitObstacle(env.loadedAssets, env.obstacles, gameWidth, gameHeight);
      drawSkier();
      env.obstacles = obst.drawObstacles(skier);
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
        {


          requestAnimationFrame(gameLoop);
        }
      }, timeOut);

    }
    else {
      requestAnimationFrame(gameLoop);
    }
  };


  var setupKeyhandler = function () {
    $(window).keydown(function (event) {
      var direction = skier.eventHandler(event);
      if (direction != null) {
        obst.placeNewObstacle(skier);

      }
    });
  };

  var initGame = function () {
    env = new EnvironmentAssets();
    obst = new ObstaclesManager(gameWidth, gameHeight);
    setupKeyhandler();
    env.loadAssets().then(function () {
      obst.placeInitialObstacles();

      requestAnimationFrame(gameLoop);
    });
  };

  initGame(gameLoop);
});
