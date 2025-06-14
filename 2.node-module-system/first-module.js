function add (a, b){
    return a + b;   
}

function subtrct (a, b){
    return a - b;   
}

function multiply (a, b){
    return a * b;   
}

function divide (a, b){
    if(b === 0){
        throw new Error("Can not divide by 0");
    }
    return a / b;   
}
// Exporting functions
module.exports = {
    add,
    subtrct,
    multiply,
    divide
};
