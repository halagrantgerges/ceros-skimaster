class Skier {
  skierDirection;
  skierMapX;
  skierMapY;
  skierSpeed;

  constructor() {
    console.log("new skier");
    this.skierDirection = 5;
    this.skierMapX = 0;
    this.skierMapY = 0;
    this.skierSpeed = 8;
  }

  moveSkier = function () {
    console.log("move skier", this.skierDirection);
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
      default:
        skierAssetName = "skierRight";
    }

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


  didIHitObstacle = function (loadedAssets, obstacles, gameWidth, gameHeight) {
    var skierImage = loadedAssets[this.getSkierAsset()];
    var skierRect = {
      left: this.skierMapX + gameWidth / 2,
      right: this.skierMapX + skierImage.width + gameWidth / 2,
      top: this.skierMapY + skierImage.height - 5 + gameHeight / 2,
      bottom: this.skierMapY + skierImage.height + gameHeight / 2,
    };

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
    }

    return returnedVal;
  }

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
}
