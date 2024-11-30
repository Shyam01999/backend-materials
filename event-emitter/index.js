const eventEmitter = require('events');

const myEventEmitter = new eventEmitter();

//event
myEventEmitter.on('greet', (name) => {
    console.log(`Hello ${name}`);
})

//call the event or trigger the event
myEventEmitter.emit('greet', "Shyam");