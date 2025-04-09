const fs = require("fs");
const path = require("path");

const dataFolder = path.join(__dirname, "data");

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
