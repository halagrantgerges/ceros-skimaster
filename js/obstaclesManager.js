class ObstaclesManager {
    gameWidth;
    gameHeight;

    constructor(gameWidth, gameHeight) {
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;

    }


    drawObstacles = function (skier) {
        var newObstacles = [];
        var gameWidth = this.gameWidth;
        var gameHeight = this.gameHeight;

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

        return newObstacles;
    }




    placeInitialObstacles = function () {
        var gameWidth = this.gameWidth;
        var gameHeight = this.gameHeight;

        var numberObstacles = Math.ceil(
            _.random(5, 7) * (gameWidth / 800) * (gameHeight / 500)
        );

        var minX = -50;
        var maxX = gameWidth + 50;
        var minY = gameHeight / 2 + 100;
        var maxY = gameHeight + 50;

        for (var i = 0; i < numberObstacles; i++) {
            this.placeRandomObstacle(minX, maxX, minY, maxY);
        }
        env.obstacles = _.sortBy(env.obstacles, function (obstacle) {

            var obstacleImage = env.loadedAssets[obstacle.type];

            return obstacle.y + obstacleImage.height;
        });
    }

    placeRandomObstacle = function (minX, maxX, minY, maxY) {
        var obstacleIndex = _.random(0, env.obstacleTypes.length - 1);

        var position = this.calculateOpenPosition(minX, maxX, minY, maxY);

        env.obstacles.push({
            type: env.obstacleTypes[obstacleIndex],
            x: position.x,
            y: position.y,
        });
    }


    calculateOpenPosition = function (minX, maxX, minY, maxY) {
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

            return this.calculateOpenPosition(minX, maxX, minY, maxY);
        } else {
            return {
                x: x,
                y: y,
            };
        }
    };



    placeNewObstacle = function (skier) {

        var direction = skier.skierDirection;
        var shouldPlaceObstacle = _.random(1, 8);
        if (shouldPlaceObstacle !== 8) {
            return;
        }

        var leftEdge = skier.skierMapX;
        var rightEdge = skier.skierMapX + this.gameWidth;
        var topEdge = skier.skierMapY;
        var bottomEdge = skier.skierMapY + this.gameHeight;

        switch (direction) {
            case 1: // left
                this.placeRandomObstacle(leftEdge - 50, leftEdge, topEdge, bottomEdge);
                break;
            case 2: // left down
                this.placeRandomObstacle(leftEdge - 50, leftEdge, topEdge, bottomEdge);
                this.placeRandomObstacle(leftEdge, rightEdge, bottomEdge, bottomEdge + 50);
                break;
            case 3: // down
                this.placeRandomObstacle(leftEdge, rightEdge, bottomEdge, bottomEdge + 50);
                break;
            case 4: // right down
                this.placeRandomObstacle(rightEdge, rightEdge + 50, topEdge, bottomEdge);
                this.placeRandomObstacle(leftEdge, rightEdge, bottomEdge, bottomEdge + 50);
                break;
            case 5: // right
                this.placeRandomObstacle(rightEdge, rightEdge + 50, topEdge, bottomEdge);
                break;
            case 6: // up
                this.placeRandomObstacle(leftEdge, rightEdge, topEdge - 50, topEdge);
                break;
            case 6: // jump
                this.placeRandomObstacle(leftEdge, rightEdge, topEdge - 50, topEdge);
                break;
        }
    };

}