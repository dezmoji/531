/*
Author: Dezmon Gilbert
Prupose: Final project using Phyllotaxis algorithm
*/

'use strict';

const app = {
    // variables 
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
        // get the canvas and context
        this.canvas = document.querySelector('canvas');
        this.ctx = this.canvas.getContext('2d');

        // set the width and height of the canvas to be equal to that of the client window
        this.WIDTH = document.body.clientWidth;
        this.HEIGHT = document.body.clientHeight;
        this.canvas.width = this.WIDTH;
        this.canvas.height = this.HEIGHT;

        // find the center of the page
        this.CENTER_X = this.WIDTH / 2;
        this.CENTER_Y = this.HEIGHT / 2;

        // set up GUI
        this.setUpGUI();

        // start the update loop
        this.update();
    },

    setUpGUI() {
        // create a GUI function
        let GUIObj = function() {
            this.angle = 137.50;
            this.color = '#ff0000';
            this.reset = function() {
                app.ctx.clearRect(0, 0, app.WIDTH, app.HEIGHT);
                app.n = 0;
            };
        };

        // create and setup the GUI menu
        this.text = new GUIObj();
        this.gui = new dat.GUI();
        this.gui.add(this.text, 'angle', 137.0, 138.0).step(.01);
        this.gui.addColor(this.text, 'color');
        this.gui.add(this.text, 'reset');
    },

    update() {
        // request the next frame
        requestAnimationFrame(this.update.bind(this));

        // find the angle for the next circle to be placed
        let angle = this.n * (this.text.angle * (Math.PI / 180));

        // find the where the center of the next circle should be
        let r = this.c * Math.sqrt(this.n);

        // find the x,y value of the circle
        let x = r * Math.cos(angle) + this.CENTER_X;
        let y = r * Math.sin(angle) + this.CENTER_Y;

        // create the circle
        this.ctx.fillStyle = this.text.color;
        this.ctx.beginPath();
        this.ctx.arc(x, y, 2, 0, Math.PI * 2);
        this.ctx.fill();

        // increment n
        this.n++;
    }
}

window.onload = () => app.init();