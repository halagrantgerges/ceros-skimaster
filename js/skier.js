class Skier {
  skierDirection;
  skierMapX;
  skierMapY;
  skierSpeed;
  skierDistance;
  previousDirection;

  // init object variables
  constructor() {
    this.skierDirection = 5;
    this.skierMapX = 0;
    this.skierMapY = 0;
    this.skierSpeed = 8;
    this.skierDistance = 0;
    this.previousDirection = 0;
    this.beforeJumpDirection = 0;
  }

  // change X and Y of the skier
  moveSkier = function () {
    switch (this.skierDirection) {
      case 2:
        this.skierMapX -= Math.round(this.skierSpeed / 1.4142);
        this.skierMapY += Math.round(this.skierSpeed / 1.4142);
        break;
      case 3:
        this.skierMapY += this.skierSpeed;
        break;
      case 4:
        this.skierMapX += this.skierSpeed / 1.4142;
        this.skierMapY += this.skierSpeed / 1.4142;
        break;
    }
  };
  // get skier image based on the direction
  getSkierAsset = function () {
    var skierAssetName;

    switch (this.skierDirection) {
      case 0:
        skierAssetName = "skierCrash";
        break;
      case 1:
        skierAssetName = "skierLeft";
        break;
      case 2:
        skierAssetName = "skierLeftDown";
        break;
      case 3:
        skierAssetName = "skierDown";
        break;
      case 4:
        skierAssetName = "skierRightDown";
        break;
      case 5:
        skierAssetName = "skierRight";
        break;

      // implementing the jump
      case 7: case 8: case 9: case 10: case 11:
        let jumpImgNum = (this.skierDirection % 7) + 1;
        skierAssetName = "skierJump" + jumpImgNum;

        if (this.skierDirection == 7 && this.beforeJumpDirection == 0) {
          this.beforeJumpDirection = this.previousDirection;
        }
        if (this.previousDirection >= 7) {
          this.skierDirection++;
        }
        break;

      case 12:
        this.skierDirection = this.beforeJumpDirection;
        this.beforeJumpDirection = 0;
        this.skierSpeed = 8;

        return this.getSkierAsset();
        break;
      default:
        skierAssetName = "skierRight";
    }

    this.previousDirection = this.skierDirection;
    return skierAssetName;
  };

  intersectRect = function (r1, r2) {
    return !(
      r2.left > r1.right ||
      r2.right < r1.left ||
      r2.top > r1.bottom ||
      r2.bottom < r1.top
    );
  }


  // check if the skier hit an obstacle
  didIHitObstacle = function (loadedAssets, obstacles, gameWidth, gameHeight) {
    var skierImage = loadedAssets[this.getSkierAsset()];
    var skierRect = {
      left: this.skierMapX + gameWidth / 2,
      right: this.skierMapX + skierImage.width + gameWidth / 2,
      top: this.skierMapY + skierImage.height - 5 + gameHeight / 2,
      bottom: this.skierMapY + skierImage.height + gameHeight / 2,
    };
    var dir = this.skierDirection;
    var collision = _.find(obstacles, function (obstacle) {
      var obstacleImage = env.loadedAssets[obstacle.type];
      var obstacleRect = {
        left: obstacle.x,
        right: obstacle.x + obstacleImage.width,
        top: obstacle.y + obstacleImage.height - 5,
        bottom: obstacle.y + obstacleImage.height,
      };
      return !(
        obstacleRect.left > skierRect.right ||
        obstacleRect.right < skierRect.left ||
        obstacleRect.top > skierRect.bottom ||
        obstacleRect.bottom < skierRect.top
      );
    });


    if (collision) {
      this.skierSpeed = 8;
      this.skierDistance = 0;
      this.skierDirection = 0;
    }
  };


  eventHandler = function (event) {

    var returnedVal = null;
    switch (event.which) {
      case 37: // left
        if (this.skierDirection === 1) {
          this.skierMapX -= this.skierSpeed;
          returnedVal = this.skierDirection;
        } else {
          this.skierDirection--;
        }
        event.preventDefault();
        break;
      case 39: // right
        if (this.skierDirection === 5) {
          this.skierMapX += this.skierSpeed;
          returnedVal = this.skierDirection;
        } else {
          this.skierDirection++;
        }
        event.preventDefault();
        break;
      case 38: // up
        if (this.skierDirection === 1 || this.skierDirection === 5) {
          this.skierMapY -= this.skierSpeed;
          returnedVal = 6;

        }
        event.preventDefault();
        break;
      case 40: // down
        this.skierDirection = 3;
        event.preventDefault();
        break;

      case 32: // space (jump)
        this.skierDirection = 7;
        event.preventDefault();

        break;
    }

    return returnedVal;
  }

  moveSkier = function () {

    switch (this.skierDirection) {
      case 2:
        this.skierMapX -= Math.round(this.skierSpeed / 1.4142);
        this.skierMapY += Math.round(this.skierSpeed / 1.4142);
        this.skierDistance++;
        obst.placeNewObstacle(this);
        break;
      case 3:
        this.skierMapY += this.skierSpeed;
        this.skierDistance++;
        obst.placeNewObstacle(this);
        break;
      case 4:
        this.skierMapX += this.skierSpeed / 1.4142;
        this.skierMapY += this.skierSpeed / 1.4142;
        this.skierDistance++;
        obst.placeNewObstacle(this);
        break;
    }

    if (this.skierDistance != 0 && this.skierDistance % 100 == 0)
      this.skierSpeed++;
  };
}
