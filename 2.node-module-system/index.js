const firstModule = require('./first-module');

console.log("Sum result", firstModule.add(2, 3));

try {
    console.log("divide result", firstModule.divide(0, 100));
} catch (error) {
    console.log("An error occurred: ", error.message);
    // Handle the error appropriately       
}