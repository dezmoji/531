/*
Author: Dezmon Gilbert
Purpose: IGME 531 Project 1 
Dependancies: three.js, tonal, dat.gui
*/

'use strict';
const THREE = require('three');
const Tonal = require('tonal');
const dat = require('dat.gui');

const app = {
    init() {
        // holds exisiting spheres
        this.sphereList = [];

        // holds midi values
        this.midiValues = [];
        for (let i = 0; i < 128; i++) {
            this.midiValues.push(i);
        };

        // color for the sphere material
        this.color = "#ffffff";

        // initialize variables for lorenz attractor 
        this.curX = 0.1;
        this.curY = 0;
        this.curZ = 0;
        this.a = 10.0;
        this.b = 28.0;
        this.c = 8.0 / 3.0;
        this.h = .01;
        this.i = 0;

        this.scene = new THREE.Scene();

        this.camera = new THREE.PerspectiveCamera(
            75, // FOV 
            window.innerWidth / window.innerHeight, // aspect ratio
            .1, // near plane
            1000 // far plane
        );

        // move camera back
        this.camera.position.z = 100;

        this.setupAudio();
        this.createRenderer();
        this.createLights();
        this.createGUI();

        this.render();
    },

    setupAudio() {
        this.audioCtx = new AudioContext();
        this.osc = this.audioCtx.createOscillator();
        this.delay = this.audioCtx.createDelay();
        this.delay.delayTime.setValueAtTime(.5, this.audioCtx.currentTime);
        this.osc.frequency.setValueAtTime(220, this.audioCtx.currentTime);
        this.osc.connect(this.delay);
        this.delay.connect(this.audioCtx.destination);
        this.osc.connect(this.audioCtx.destination);
        this.osc.start();
    },

    // creates the gui for the user to manipualte values
    createGUI() {
        let setUpGUI = function() {
            this.message = "Move w/ WASD";
            this.background = "#000000";
            this.a = 10.0;
            this.b = 28.0;
            this.c = 8.0 / 3.0;
            this.mean = 64;
            this.range = 10;
        };

        this.text = new setUpGUI();
        this.gui = new dat.GUI();
        this.gui.add(this.text, 'message');
        this.gui.addColor(this.text, 'background');
        this.gui.add(this.text, 'a', 5, 30);
        this.gui.add(this.text, 'b', 25, 50);
        this.gui.add(this.text, 'c', 1, 4).step(1 / 3);
        this.gui.add(this.text, 'mean', 0, 127).step(1);
    },

    createRenderer() {
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        // take the THREE.js canvas element and append it to our page
        document.body.appendChild(this.renderer.domElement);

        this.render = this.render.bind(this);
    },

    createLights() {
        this.ambient = new THREE.AmbientLight(0x404040, .15);
        this.scene.add(this.ambient);

        this.pointLight = new THREE.PointLight(0x990000);
        this.pointLight.position.z = 50;
        this.scene.add(this.pointLight);
    },

    render() {
        window.requestAnimationFrame(this.render);

        this.lorenz();

        // update the scene background
        this.scene.background = new THREE.Color(this.text.background);

        this.renderer.render(this.scene, this.camera);
    },

    // calculates lorenz values 
    lorenz() {
        // update values from the gui
        this.a = this.text.a;
        this.b = this.text.b;
        this.c = this.text.c;

        // set the previous values
        this.prevX = this.curX;
        this.prevY = this.curY;
        this.prevZ = this.curZ;

        // use the lorenz formula
        this.curX = this.prevX + this.h * this.a * (this.prevY - this.prevX);
        this.curY = this.prevY + this.h * (this.prevX * (this.b - this.prevZ) - this.prevY);
        this.curZ = this.prevZ + this.h * (this.prevX * this.prevY - this.c * this.prevZ);

        // wait until after the 100th frame
        if (this.i > 100) {
            this.createSphere(this.curX, this.curY, this.curZ);
        }
        this.i++;
    },

    // creates the spheres for the lorenz
    createSphere(x, y, z) {
        // create the geometry, material, and mesh of the sphere
        this.geometry = new THREE.SphereBufferGeometry(.25);
        this.material = new THREE.MeshBasicMaterial({ color: this.color });
        let sphere = new THREE.Mesh(this.geometry, this.material);

        // set the position of the sphere
        sphere.position.x = x;
        sphere.position.y = y;
        sphere.position.z = z;

        // add the sphere to the scene and the sphere list
        this.scene.add(sphere);
        this.sphereList.push(sphere);

        // after 1000 spheres are on screen, start cleaning up old spheres
        if (this.sphereList.length >= 1000) {
            let removedSphere = this.sphereList.shift();
            this.scene.remove(removedSphere);
            removedSphere.material.dispose();
            removedSphere.geometry.dispose();
        }

        // play a different note every 25 frames
        if (this.i % 25 == 0) this.playNote();
    },

    // plays a note
    playNote() {
        // using a modified standard distribution equation, find an index value
        // "a" serves as a range modifier while the "mean" is the midi value that 
        // the equation is centered around.
        let index = Math.floor(this.text.mean + ((Math.random() * this.text.a * 2) - this.text.a)) % this.midiValues.length;

        // use the index to access the correct midi value, then play the frequency
        let value = this.midiValues[index];
        let freq = Tonal.freq(value);
        this.osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

        // using the midi value, determine rgb values for the spheres
        let r = (value * 2) % 255;
        let g = Math.abs((value + Math.floor((Math.random() * this.text.b * 2) - this.text.b)) % 255);
        let b = Math.abs(value + Math.floor((Math.random() * this.c * 2) - this.text.c) * 5) % 255;
        this.color = new THREE.Color("rgb(" + r + ", " + g + ", " + b + ")");
    }
};

window.onload = () => app.init();

// event listener for camera
window.addEventListener("keydown", function(event) {
    let key = event.key;

    if (key == 'a') {
        app.camera.position.x = app.camera.position.x - .25;
    }
    if (key == 'd') {
        app.camera.position.x = app.camera.position.x + .25;
    }
    if (key == 'w') {
        app.camera.position.z = app.camera.position.z - .25;
    }
    if (key == 's') {
        app.camera.position.z = app.camera.position.z + .25;
    }
    app.camera.updateProjectionMatrix();
});