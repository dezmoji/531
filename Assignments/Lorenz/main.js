'use strict';
const app = {
    init() {
        // create the properties for the lorenz function
        this.curX = 0.1;
        this.curY = 0;
        this.curZ = 0;
        this.a = 10.0;
        this.b = 28.0;
        this.c = 8.0 / 3.0;
        this.h = .01;
        this.i = 0;
        this.material = new THREE.LineBasicMaterial({ color: 0x0000ff });

        // pretty simple...
        this.scene = new THREE.Scene();

        // camera is a bit more involved...
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

    // creates GUI
    createGUI() {
        let setUpGUI = function() {
            this.message = "Move w/ WASD";
            this.a = 10.0;
            this.b = 28.0;
            this.c = 8.0 / 3.0;
            this.h = .01;
            this.fog = function() {
                app.scene.fog = new THREE.Fog(0x5b6166, 1, 50);
            };
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
        this.gui.add(this.text, 'a', 5, 30);
        this.gui.add(this.text, 'b', 25, 50);
        this.gui.add(this.text, 'c', 1, 4).step(1 / 3);
        this.gui.add(this.text, 'h', .01, .05).step(.01);
        this.gui.add(this.text, 'fog');
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

        // create the geometry
        let geometry = new THREE.Geometry();

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
            geometry.vertices.push(new THREE.Vector3(this.prevX, this.prevY, this.prevZ));
            geometry.vertices.push(new THREE.Vector3(this.curX, this.curY, this.curZ));
        }
        this.i++;

        // create the new line and add it to the scene
        this.line = new THREE.Line(geometry, this.material);
        this.scene.add(this.line);
    }
}

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