require("dotenv").config();
const express = require("express");
const connectToDb = require("./database/db");

const app = express();
const PORT = process.env.PORT || 5000;

//connect to database
connectToDb();

//middlware
// app.use(express.json());

//routes
// app.use("/api/user",);

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
})

