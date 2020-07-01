dd = console.log;

class Game {
    items = [];
    width = 0;
    height = 0;
    x_size = 0;
    y_size = 0;
    canvas = null;

    constructor(canvas, width, height, x_size, y_size) {
        this.canvas = canvas;
        this.width = width;
        this.height = height;
        this.x_size = x_size;
        this.y_size = y_size;

        this.drawBoard(width, height, x_size, y_size);
        this.fillItem(x_size, y_size);
        this.showItem();
    }

    drawBoard(width, height, x_size, y_size) {
        const ctx = this.canvas.getContext('2d');

        this.x_block = width / x_size;
        this.y_block = height / y_size;
        
        ctx.globalAlpha = .5;
        ctx.strokeRect(0,0,width,height);
        
        Array(x_size).fill(null).map((x,idx) => idx * this.x_block).forEach(x => ctx.fillRect(x, 0, 1, height));
        Array(y_size).fill(null).map((x,idx) => idx * this.y_block).forEach(x => ctx.fillRect(0, x, width, 1));
    }

    fillItem(x_size, y_size) {
        Array(y_size).fill(0).map((x,idx) => idx).forEach((y,idx) => {
            Array(x_size).fill(0).map((x,idx) => idx).forEach((x,idx) => {
                this.items.push(new GameItem(x, y));
            })
        });

        this.removeExploding();
    }

    showItem() {
        const {x_block, y_block, canvas} = this;
        const ctx = canvas.getContext('2d');
        ctx.globalAlpha = 1;
        ctx.font = "16pt Malgun Gothic"
        this.items.forEach((x) => {
            const width = ctx.measureText(x.type).width;
            ctx.fillText(x.type, x_block * x.coordinate.x + x_block / 2 - width / 2, y_block * x.coordinate.y + y_block / 2 + 12);
        });
    }

    removeExploding() {

    }
}

class GameItem {
    type = null;

    constructor(x,y) {
        this.type = ['사과','배','복숭아','키위'].sort(() => .5 - Math.random())[0];
        this.coordinate = {x,y};
    }

    get canvasXPos() {
        return 1;
    }

    get canvasYPos() {
        return 2;
    }

}

window.onload = function() {
    const width = 760,
          height = 760,
          x_size = 10,
          y_size = 10;

    const canvas = document.getElementById('game');

    const game = new Game(canvas, width, height, x_size, y_size);
    console.log(game);
}