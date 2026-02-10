const http = require("http");

const server = http.createServer((req, res) => {
    const url = req.url;
    if (url === '/') {
        res.writeHead(200, { "Content-Type": "text-plain" });
        res.end("Home page")
    } else if (url === '/project') {
        res.writeHead(200, { "Content-Type": "text-plain" });
        res.end("Project")
    } else {
        res.writeHead(404, { "Content-Type": "text-plain" });
        res.end("This url does not exist")
    }
   
})

const PORT = 5000;

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})