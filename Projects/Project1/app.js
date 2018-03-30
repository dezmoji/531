'use strict';
const THREE = require('three');
const Tonal = require('tonal');
const dat = require('dat.gui');

const app = {
    init() {
        this.audioCtx = new AudioContext();
        this.osc = this.audioCtx.createOscillator();
        this.color = 1;
        this.delay = this.audioCtx.createDelay();
        this.delay.delayTime.setValueAtTime(.5, this.audioCtx.currentTime);
        this.osc.frequency.setValueAtTime(220, this.audioCtx.currentTime);
        // this.delay.connect(this.osc);
        this.osc.connect(this.delay);
        this.delay.connect(this.audioCtx.destination);
        this.osc.connect(this.audioCtx.destination);
        this.osc.start();
        this.midiValues = [];
        this.sphereList = [];
        this.sphereCounter = 0;
        for (let i = 0; i < 128; i++) {
            this.midiValues.push(i);
        };
        this.color = "#ffffff";
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

        this.createRenderer();
        this.createLights();
        this.createGUI();

        this.render();
    },


    createGUI() {
        let setUpGUI = function() {
            this.message = "Move w/ WASD";
            this.color = "#ffffff";
            this.a = 10.0;
            this.b = 28.0;
            this.c = 8.0 / 3.0;
            this.h = .01;
            this.preset1 = function() {
                this.a = 10.0;
                this.b = 28.0;
                this.c = 8.0 / 3.0;
                this.h = .01;
                app.gui.updateDisplay();
            }
            this.preset2 = function() {
                this.a = 28.0;
                this.b = 46.92;
                this.c = 4;
                this.h = .01;
                app.gui.updateDisplay();
            }
        };

        this.text = new setUpGUI();
        this.gui = new dat.GUI();
        this.gui.add(this.text, 'message');
        this.gui.addColor(this.text, 'color');
        this.gui.add(this.text, 'a', 5, 30);
        this.gui.add(this.text, 'b', 25, 50);
        this.gui.add(this.text, 'c', 1, 4).step(1 / 3);
        this.gui.add(this.text, 'h', .01, .05).step(.01);
        this.gui.add(this.text, 'preset1');
        this.gui.add(this.text, 'preset2');

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

        this.renderer.render(this.scene, this.camera);
    },

    lorenz() {
        // update values from the gui
        this.a = this.text.a;
        this.b = this.text.b;
        this.c = this.text.c;
        this.h = this.text.h;

        // set the previous values
        this.prevX = this.curX;
        this.prevY = this.curY;
        this.prevZ = this.curZ;

        // use the lorenz formula
        this.curX = this.prevX + this.h * this.a * (this.prevY - this.prevX);
        this.curY = this.prevY + this.h * (this.prevX * (this.b - this.prevZ) - this.prevY);
        this.curZ = this.prevZ + this.h * (this.prevX * this.prevY - this.c * this.prevZ);

        // wait until after the 100th value is calculated
        if (this.i > 100) {
            this.createSphere(this.curX, this.curY, this.curZ);
        }
        this.i++;
    },

    createSphere(x, y, z) {
        /*
        this.color = this.text.color;
        this.geometry = new THREE.PlaneBufferGeometry(1, 1);
        this.material = new THREE.MeshBasicMaterial({ color: app.color });
        this.plane = new THREE.Mesh(this.geometry, this.material);
        //this.sphere.position = new THREE.Vector3(x, y, z);
        this.plane.position.x = x;
        this.plane.position.y = y;
        this.plane.position.z = z;
        this.scene.add(this.plane);
        */

        this.geometry = new THREE.SphereBufferGeometry(.25);
        this.material = new THREE.MeshBasicMaterial({ color: this.color });
        let sphere = new THREE.Mesh(this.geometry, this.material);
        sphere.name = this.sphereCounter;
        this.sphereCounter++;
        sphere.position.x = x;
        sphere.position.y = y;
        sphere.position.z = z;

        this.scene.add(sphere);
        this.sphereList.push(sphere);
        if (this.sphereList.length >= 1000) {
            let removedSphere = this.sphereList.shift();
            this.scene.remove(removedSphere);
            removedSphere.material.dispose();
            removedSphere.geometry.dispose();
        }

        if (this.i % 25 == 0) this.playKeyNote();
    },

    playKeyNote() {
        // look into screen aligned/buildboards/limit number of meshes
        // this.value = this.midiValues[(Math.floor(Math.random() * 128))];

        let alpha = this.a * Math.cos(this.i);
        let beta = this.b * Math.sin(this.i);
        let gamma = this.c * Math.sqrt(this.i);

        let omega = Math.abs(Math.floor((alpha * beta * gamma / this.h)) % this.midiValues.length);
        let value = this.midiValues[omega];
        let rgb = (value * 2);
        this.color = new THREE.Color("rgb(" + rgb + ", " + Math.min(rgb * 3, 255) + ", " + Math.floor(rgb / 4) + ")");

        let freq = Tonal.freq(value);
        this.osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);
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