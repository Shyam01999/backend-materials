const eventEmitter = require('events');

class MyCustomEventEmitter extends eventEmitter {
    constructor() {
        super();
        this.greeting = "Hello";
    }

    greet(name) {
        this.emit("gretting", `${this.greeting}, ${name}`);
    }
}

const myCustomEmitter = new MyCustomEventEmitter();

myCustomEmitter.on('greeting', (input) => {
    console.log(`Greeting event`, input);
});

myCustomEmitter.greet('Shyam');