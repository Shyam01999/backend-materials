const fs = require("fs");
const path = require("path");

const dataFolder = path.join(__dirname, "data");
console.log("dataFolder", dataFolder);

if (!fs.existsSync(dataFolder)) {
    fs.mkdirSync(dataFolder)
}

const filePath = path.join(dataFolder, "example.txt");

fs.writeFileSync(filePath, "Hello from node js");
console.log("file created successfully");

// const readContentFromFile = fs.readFileSync(filePath, "utf-8");
// console.log("file content:", readContentFromFile);

fs.appendFileSync(filePath, "\n This is a append content into the file");
console.log("new content appended")

const readContentFromFile = fs.readFileSync(filePath, "utf-8");
console.log("file content:", readContentFromFile);

//Example of JS file creation
// const filePath2 = path.join(dataFolder, 'demo.js');

// fs.writeFileSync(filePath2, 'This is a js file');
// console.log("Js file created");

// fs.appendFileSync(filePath2, "\n This is a append content into the file");
// console.log("new content appended")

// const readContentFromJsFile = fs.readFileSync(filePath2, 'utf-8');
// console.log("Js file content", readContentFromJsFile)

