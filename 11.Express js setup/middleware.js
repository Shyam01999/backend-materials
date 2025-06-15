const express = require("express");
const app = express();

//middleware
const requestTimeStampLogger = (req, res, next) => {
    const currentTime = new Date().toISOString();
    console.log("Current Time is:", currentTime, "Method : ", req.method, "URL:", req.url);
    
    next()
};

app.use(requestTimeStampLogger);

app.get("/", (req, res) => {
    res.send("Home page")
});

app.get("/about", (req, res) => {
    res.send("About page")
});

const PORT = 3000
app.listen(PORT, () => {
    console.log(`Server is now running on port ${PORT}`)
});

