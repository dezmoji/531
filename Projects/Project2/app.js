'use strict';

//phyllotaxis

const app = {
    canvas: undefined,
    ctx: undefined,
    WIDTH: 0,
    HEIGHT: 0,
    CENTER_X: 0,
    CENTER_Y: 0,
    n: 0,
    c: 4,
    gui: null,

    init() {
        this.canvas = document.querySelector('canvas');
        this.ctx = this.canvas.getContext('2d');

        this.WIDTH = document.body.clientWidth;
        this.HEIGHT = document.body.clientHeight;
        this.canvas.width = this.WIDTH;
        this.canvas.height = this.HEIGHT;
        this.CENTER_X = this.WIDTH / 2;
        this.CENTER_Y = this.HEIGHT / 2;

        //ctx.moveTo(this.CENTER_X, this.CENTER_Y);

        this.setUpGUI();
        this.update();
    },

    setUpGUI() {

    },

    update() {
        requestAnimationFrame(this.update.bind(this));

        let angle = this.n * (137.508 * (Math.PI / 180));
        let r = this.c * Math.sqrt(this.n);

        let x = r * Math.cos(angle) + this.CENTER_X;
        let y = r * Math.sin(angle) + this.CENTER_Y;

        this.ctx.beginPath();
        this.ctx.fillStyle = 'red';
        this.ctx.arc(x, y, 2, 0, Math.PI * 2);
        this.ctx.fill();
        this.n++;
    }
}

window.onload = () => app.init();