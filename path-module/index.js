const path = require("path");

const directoryname = path.dirname(__filename);
console.log("directory name:", directoryname);

const filename = path.basename(__filename);
console.log("filename", filename);

const extensionname = path.extname(__filename);
console.log("extensionname", extensionname);

const pathjoin = path.join("user", '/path-module', 'document');
console.log("pathjoin", pathjoin);

const resolvepath = path.resolve("document", "user", "path-module");
console.log("resolvepath", resolvepath);

