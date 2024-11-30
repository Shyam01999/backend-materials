//one example 
function delay(time){
    return new Promise((resolve)=> setTimeout(resolve, time));
}

async function delayGreet(name){
    await delay(2000);
    console.log('Hello', name)
}

delayGreet("Samrat");

//second example 

async function divide(num1, num2){
    try{
        if(num2 === 0){
            throw new Error("Can not divide by 0")
        }

        return num1/num2;
    }
    catch(error){
        console.log(error, error)
    }
}

async function main() {
    await divide(10, 5);
    await divide(10, 0);
    
}

main();
