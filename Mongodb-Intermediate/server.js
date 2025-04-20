require("dotenv").config();
const express = require("express");
const connectToDb = require("./database/db");
const authRoutes = require("./routes/auth.routes");
const homeRoutes = require("./routes/home.routes");
const imageRoutes = require("./routes/image.routes");

const app = express();
const PORT = process.env.PORT || 8080
connectToDb();

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/home", homeRoutes);
app.use("/api/image", imageRoutes)


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})