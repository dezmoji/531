!function () {
    'use strict';

    let currentGrid = [];
    let nextGrid = [];
    let gridSize = 100;

    const app = {
        canvas: null,
        ctx: null,

        init() {
            this.canvas = document.getElementsByTagName('canvas')[0]
            this.ctx = this.canvas.getContext('2d')
            this.draw = this.draw.bind(this)
            this.fullScreenCanvas()

            window.onresize = this.fullScreenCanvas.bind(this)

            requestAnimationFrame(this.draw)

            for (let i = 0; i < gridSize; i++) {
                currentGrid[i] = [];
                nextGrid[i] = [];

                for (let j = 0; j < gridSize; j++) {
                    currentGrid[i][j] = Math.random() > .5 ? 1 : 0;
                    nextGrid[i][j] = 0;
                }
            }
        },

        fullScreenCanvas() {
            this.canvas.width = this.height = window.innerWidth
            this.canvas.height = this.width = window.innerHeight
        },

        // update your simulation here
        animate() {
            // for each cell ...
            for (let i = 0; i < gridSize; i++) {
                for (let j = 0; j < gridSize; j++) {
                    // leave the edges alone
                    if (i == 0 || j == 0 || i == gridSize - 1 || j == gridSize - 1) {
                        nextGrid[i][j] = currentGrid[i][j];
                        continue;
                    }
                    
                    let neighborsAlive = 0;
                    
                    // count the number of live neighbors around the current cell
                    for(let x = -1; x < 2; x++){
                        for(let y = -1; y < 2; y++){
                            neighborsAlive += currentGrid[x + i][y + j];
                        }
                    }
                    
                    // subtract the value of the current cell 
                    neighborsAlive -= currentGrid[i][j];

                    // if the cell is alive
                    if (currentGrid[i][j] == 1) {

                        // check for underpoplutation/overpopulation to see if cell lives on
                        if (neighborsAlive > 3 || neighborsAlive < 2) {
                            // cell dies 
                            nextGrid[i][j] = 0;
                            continue;
                        } 
                        
                        // cell lives on to next gen
                        else
                            nextGrid[i][j] = 1;
                            continue;
                        }

                    // if the cell is dead but has exactly 3 neighbors
                    if (currentGrid[i][j] == 0 && neighborsAlive == 3) {
                        // the cell will be reproduced
                        nextGrid[i][j] = 1;
                        continue;
                    }
                    // cell stays dead
                    else{
                        nextGrid[i][j] = 0;
                    }
                }
            }

            // assign values in nextGrid to currentGrid
            let swap = currentGrid;
            currentGrid = nextGrid;
            nextGrid = swap;
        },

        draw() {
            requestAnimationFrame(this.draw)
            this.animate()

            // draw to your canvas here
            this.ctx.fillStyle = 'black'
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)

            let cellWidth = this.canvas.width / gridSize;
            let cellHeight = this.canvas.height / gridSize;
            console.log(currentGrid);

            for (let i = 0; i < gridSize; i++) {
                let row = currentGrid[i];
                let yPos = i * cellHeight;

                for (let j = 0; j < gridSize; j++) {
                    let cell = row[j];
                    let xPos = j * cellWidth

                    if (cell === 1) {
                        this.ctx.fillStyle = 'white'
                        this.ctx.fillRect(xPos, yPos, cellWidth, cellHeight)
                    }
                }
            }
        }
    }
    window.onload = app.init.bind(app)
}()
