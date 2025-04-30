require("dotenv").config();
const express = require("express");
const connectToDb = require("./database/db");
const productRoutes = require("./routes/product.routes");

const app = express();
const PORT = process.env.PORT || 8080
connectToDb();

app.use(express.json());

app.use("/api/product", productRoutes);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})