require("dotenv").config();
const express = require("express");
const connectToDb = require("./database/db");
const bookRoute = require("./routes/book.routes")

const app = express();
const PORT = process.env.PORT || 3000;

//connect to database
connectToDb();

//middlware
app.use(express.json());

//routes
app.use("/api/book", bookRoute);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})

