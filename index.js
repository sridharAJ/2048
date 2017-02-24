/**
 * Created by 12072 on 24/02/17.
 */
var TwentyFourtyEight = require('./2048');

var twentyFourtyEight = new TwentyFourtyEight(4, 2);
twentyFourtyEight.print();

const readline = require('readline');
readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);
process.stdin.on('keypress', (str, key) => {
    if (key.ctrl && key.name === 'c') {
        process.exit();
    } else {
        if(key.name === 'left' || key.name === 'right' || key.name === 'down' || key.name === 'up') {
            console.log(`You pressed ${key.name} key`);
            twentyFourtyEight.move(key.name);
            twentyFourtyEight.print();
            console.log("Your Current Score", twentyFourtyEight.score);
            if(twentyFourtyEight.won) {
                console.log("You won the game :)", twentyFourtyEight.score)
            }
        }else {
            console.log("Please Enter Valid inputs [left, right, up, down]");
        }
    }
});
console.log('Press any one of the Aerows [left, right, up, down]');
