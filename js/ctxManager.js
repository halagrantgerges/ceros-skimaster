class CTXManager {

    ctx;
    constructor(ctx) {

        this.ctx = ctx;

    }

    clearCanvas = function (x, y) {
        this.ctx.clearRect(0, 0, x, y);
    }

    drawInfo = function (topScore, skierDistance, skierSpeed, gameWidth) {
        this.ctx.fillStyle = "black";
        this.ctx.beginPath();
        this.ctx.font = "20px Arial";
        this.ctx.fillText(`Top Score: ` + topScore, gameWidth - 250 + 2, 50);
        this.ctx.fillText(`Distance: ` + skierDistance, gameWidth - 250 + 2, 70);
        this.ctx.fillText(`Speed: ` + skierSpeed, gameWidth - 250 + 2, 90);
        this.ctx.stroke();
    }

    drawImg = function (img, x, y, width, height) {

        this.ctx.drawImage(img, x, y, width, height);
    }

    endGame = function (gameWidth, gameHeight) {
        this.ctx.fillStyle = "red";
        this.ctx.beginPath();
        this.ctx.font = "50px Bold Arial";
        var x = (gameWidth / 3.5);
        var y = (gameHeight / 2);
        this.ctx.fillText(`GAME OVER PRESS ESC`, x, y);
        this.ctx.stroke();
    }

    resetGame = function (gameWidth, gameHeight) {
        this.clearCanvas(gameWidth, gameHeight);
        this.ctx.fillStyle = "Blue";
        this.ctx.beginPath();
        this.ctx.font = "50px Bold Arial";
        var x = (gameWidth / 3.5);
        var y = (gameHeight / 2);
        this.ctx.fillText(`Resetting Game....`, x, y);
        this.ctx.stroke();
    }

    saveScaleClear = function (gameWidth, gameHeight) {
        this.ctx.save();
        this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        this.clearCanvas(gameWidth, gameHeight);

    }

    restore = function () {
        this.ctx.restore();
    }
}