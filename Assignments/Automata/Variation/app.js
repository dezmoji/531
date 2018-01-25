/*
* One of the variations that I implemented was making the game torodial.
*
*/

!function () {
    'use strict';

    let currentGrid = [];
    let nextGrid = [];
    let gridSize = 200;

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
                    
                    let neighborsAlive = 0;
                    
                    // find the amount of neighbors alive
                    for(let x = -1; x < 2; x++){
                        for(let y = -1; y < 2; y++){
                            // find the current X and Y positions of the cell to be looked at
                            let curX = x + i;
                            let curY = y + j;
                            
                            // if the x or y would be out of bounds (meaning i or j is an edge), adjust the value accordingly
                            if(curX == -1) curX = gridSize -1;
                            if(curX >= gridSize) curX -= gridSize;
                            if(curY == -1) curY = gridSize -1;
                            if(curY >= gridSize) curY -= gridSize;
                            
                            // add the value to the amount of neighbors alive
                            neighborsAlive += currentGrid[curX][curY];
                        }
                    }
                    
                    // subtract the current cell value 
                    neighborsAlive -= currentGrid[i][j];

                    // if the cell is alive
                    if (currentGrid[i][j] == 1) {

                        // check for underpoplutation/overpopulation to see if cell lives on
                        if (neighborsAlive > 4 || neighborsAlive < 2) {
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
