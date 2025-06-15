const express = require("express");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello Welcome to expresss js")
});

const PORT = 3000
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
});