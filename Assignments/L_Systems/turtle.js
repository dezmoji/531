const Turtle = {
    create(canvas, startX, startY) {
        const turtle = Object.create(this)
        Object.assign(turtle, {
            canvas,
            weight: 1,
            color: 'red',
            pos: Victor(startX, startY),
            dir: Victor(0, -1),
            pen: 1,
            posArray: [],
            dirArray: [],
        })
        turtle.canvas.moveTo(turtle.pos.x, turtle.pos.y)
        return turtle
    },

    penUp() {
        this.pen = 0
    },

    penDown() {
        this.pen = 1
    },

    push() {
        this.posArray.push(this.pos.clone())
        this.dirArray.push(this.dir.clone())
    },
    pop() {
        this.pos = this.posArray.pop()
        this.dir = this.dirArray.pop()
        this.canvas.moveTo(this.pos.x, this.pos.y)
    },
    // THIS IS IN RADIANS!!!
    rotate(amt) {
        this.dir.rotate(amt)
    },
    move(amt) {
        if (this.pen) this.canvas.beginPath()
        this.canvas.moveTo(this.pos.x, this.pos.y)
        this.pos.x += this.dir.x * amt
        this.pos.y += this.dir.y * amt
        if (this.pen) {
            this.canvas.strokeStyle = this.color;
            this.canvas.lineTo(this.pos.x, this.pos.y)
            this.canvas.lineWidth = this.weight
            this.canvas.stroke()
            this.canvas.closePath()
        } else {
            this.moveTo(this.pos.x, this.pos.y)
        }
    }
}
