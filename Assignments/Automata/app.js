! function () {
    'use strict'

    let currentGrid = [];
    let nextGrid = [];
    let gridSize = 20;

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
            
            for(let i = 0; i < gridSize; i++){
                currentGrid[i] = [];
                nextGrid[i] = [];
                
                for(let j = 0; j < gridSize; j++){
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
            // count the number of live neighbors
            // use game of life rules to detemine if cell should live or die
            // set new cell value in nextGrid based on results
            //
            // assign values in nextGrid to currentGrid
            /*
            let swap = currentGrid
            currentGrid = nextGrid
            nextGrid = swap
            */
            //currentGrid = nextGrid.splice();
        },

        draw() {
            requestAnimationFrame(this.draw)
            this.animate()

            // draw to your canvas here
            this.ctx.fillStyle = 'black'
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
            
            let cellWidth = this.canvas.width / gridSize;
            let cellHeight = this.canvas.height / gridSize;
            
            for(let i = 0; i < gridSize; i++){
                let row = currentGrid[i];
                let yPos = i * cellHeight;
                
                for(let j = 0; j < gridSize; j++){
                    let cell = row[j];
                    let xPos = j * cellWidth
                    
                    if (cell === 1){
                         this.ctx.fillStyle = 'white'
                        this.ctx.fillRect(xPos, yPos, cellWidth, cellHeight)
                    }
                }
            }   
        }
    }

    window.onload = app.init.bind(app)

}()
