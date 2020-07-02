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
        this.x_block = width / x_size;
        this.y_block = height / y_size;

        this.drawBoard(width, height, x_size, y_size);
        this.fillItem(x_size, y_size);
        this.showItem();

        this.bindEvent();
    }

    bindEvent() {
        const {x_block, y_block} = this;

        this.canvas.addEventListener('mousedown', e => {
            const [pos_x,pos_y] = [Math.floor(e.offsetX / x_block), Math.floor(e.offsetY / y_block)];
            const target = this.items.find(x => x.coordinate.x === pos_x && x.coordinate.y === pos_y);

            dd(target);
        }, false);
    }

    drawBoard(width, height, x_size, y_size) {
        const ctx = this.canvas.getContext('2d');
        
        ctx.globalAlpha = .5;

        Array(x_size).fill(null).map((x,idx) => idx * this.x_block).forEach(x => ctx.fillRect(x, 0, 1, height));
        Array(y_size).fill(null).map((x,idx) => idx * this.y_block).forEach(x => ctx.fillRect(0, x, width, 1));
        
        ctx.strokeRect(0,0,width - 1,height - 1);
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
        ctx.strokeStyle = "#fff";
        this.items.forEach((x) => {
            const width = ctx.measureText(x.type).width;
            ctx.fillStyle = x.background;
            ctx.fillRect(x_block * x.coordinate.x, y_block * x.coordinate.y, x_block, y_block);
            ctx.strokeRect(x_block * x.coordinate.x, y_block * x.coordinate.y, x_block, y_block);
            ctx.fillStyle = "#fff";
            ctx.fillText(x.type, x_block * x.coordinate.x + x_block / 2 - width / 2, y_block * x.coordinate.y + y_block / 2 + 12);
        });
    }

    removeExploding() {
        const {y_size} = this;

        this.items.forEach((x,idx) => {
            const type = x.type;

            const [before_x, before_x_2, before_y, before_y_2] = [
                this.items[idx - 1],
                this.items[idx - 2],
                this.items[idx - y_size],
                this.items[idx - y_size * 2]
            ];

            if(!(before_x && before_x_2) || !(before_y && before_y_2)){
                return true;
            }

            if(
                (before_x.type === type && before_x_2.type === type) || 
                (before_y.type === type && before_y_2.type === type)
            ){
                x.changeType();
            }
        })
    }
}

class GameItem {
    type = null;

    constructor(x,y) {
        this.types = [
            {type: '1', background: '#111'},
            {type: '2', background: '#222'},
            {type: '3', background: '#333'},
            {type: '4', background: '#444'},
            {type: '5', background: '#555'},
            {type: '6', background: '#666'},
        ];

        Object.assign(this, this.types[Math.floor(Math.random() * this.types.length)]);
        this.coordinate = {x,y};
    }

    changeType() {
        const valid = this.types.filter(x => x.type !== this.type);
        Object.assign(this, valid[Math.floor(Math.random() * valid.length)]);
    }

}

window.onload = function() {
    const width = 760,
          height = 760,
          x_size = 12,
          y_size = 12;

    const canvas = document.getElementById('game');

    const game = new Game(canvas, width, height, x_size, y_size);
}