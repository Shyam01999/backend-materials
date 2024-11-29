
//one example
function delay(time){
    return new Promise((resolve) => setTimeout(resolve, time))
}

console.log('Promise lecture start');

delay(2000).then(() => console.log("Promise resolved after 2 seconds"))

console.log("end")

//second example
function divide(num1, num2){
    return new Promise((resolve, reject) => {
        if(num2 === 0) {
            reject('Can not divide by 0')
        }else{
            resolve(num1/num2)
        }
       
    })
}

divide(10, 2).then((res)=> console.log("res", res)).catch((error) => console.log("error", error))
divide(10, 0).then((res)=> console.log("res", res)).catch((error) => console.log("error", error))

