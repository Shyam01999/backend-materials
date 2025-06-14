const {greet} = require('./wrapper.explorer');

console.log("This is the wrapper demo module");

console.log("filename:", __filename);
console.log("dirname:", __dirname);

greet("Shyam Sundar");