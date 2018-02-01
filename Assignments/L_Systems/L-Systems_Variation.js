/*
* The variation that I made was created by changing the rule, angle and also adding a color change
* for the rotations.
*/

'use strict';

const rules = {
    F: 'F[--F][++F]F'
};
const axiom = 'F';

window.onload = function () {
    let canvas = document.querySelector('#canvas')
    let turtle = Turtle.create(canvas.getContext("2d"), canvas.width/2 , canvas.height);
    let output = axiom;
    let theta = 45 * Math.PI/180;
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
            turtle.move(11);
        }
        if(char == '+'){
            turtle.color = "black";
            turtle.rotate(-theta);
        }
        if(char == '-'){
            turtle.color = "white";
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