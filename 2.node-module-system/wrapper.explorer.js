console.log("This is the wrapper explorer module");

console.log("filename:", __filename);
console.log("dirname:", __dirname);

module.exports.greet = function(name){
    console.log("Hello, " + name + "!");
}

// module.exports.demo = function(){
//     console.log("This is a demo function from the wrapper explorer module.");
// }