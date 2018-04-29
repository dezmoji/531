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
    text: null,

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
        let GUIObj = function() {
            this.angle = 137.5;
            this.reset = function() {
                app.ctx.clearRect(0, 0, app.WIDTH, app.HEIGHT);
                app.n = 0;
            };
        };

        this.text = new GUIObj();
        this.gui = new dat.GUI();
        this.gui.add(this.text, 'angle', 137, 138).step(.1);
        this.gui.add(this.text, 'reset');

    },

    update() {
        requestAnimationFrame(this.update.bind(this));

        let angle = this.n * (this.text.angle * (Math.PI / 180));
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