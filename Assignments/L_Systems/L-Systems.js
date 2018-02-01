'use strict';

const rules = {
    F: 'F[+F]F[-F]F'
};
const axiom = 'F';

window.onload = function () {
    let canvas = document.querySelector('#canvas')
    let turtle = Turtle.create(canvas.getContext("2d"), canvas.width/2 , canvas.height);
    let output = axiom;
    let theta = 25.7 * Math.PI/180;
    let numGenerations = 6;

    // find the new output
    for (let i = 0; i < numGenerations; i++) {
        let newOutput = '';
        for (let char of output) {
            if(char == 'F') newOutput += rules[char];
        }
        newOutput = output.replace(/F/g, rules['F']);
        output = newOutput;
    }  
        
    // draw the l-system using system
    for(let char of output){
        if(char == 'F'){
            turtle.move(1);
        }
        if(char == '+'){
            turtle.rotate(-theta);
        }
        if(char == '-'){
            turtle.rotate(theta);
        }
        if(char == '['){
            turtle.push();
        }
        if(char == ']'){
            turtle.pop();
        }
    }
};