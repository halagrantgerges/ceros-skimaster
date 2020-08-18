class CTXManager {

    ctx;
    constructor(ctx) {

        this.ctx = ctx;

    }

    clearCanvas = function (x, y) {
        this.ctx.clearRect(0, 0, x, y);
    }
}