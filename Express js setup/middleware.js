const express = require("express");
const app = express();

//middleware
const myFirstMiddleware = (req, res, next) => {
    console.log("This is the first middleware run on every request");
    next()
};

app.use(myFirstMiddleware);

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

