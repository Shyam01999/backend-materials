 //one example 
 function person(name, callback){
    console.log(`Hello ${name}`);

    callback();
 }

 function address(){
    console.log(`This is second function`)
 }

 person("Shyam", address);


 //second example 
 const fs = require('fs');

 fs.readFile('input.txt', 'utf8', (err, data)=>{
    if(err){
        console.log(`Error in read file`, err)
    }

    console.log(data);
 })