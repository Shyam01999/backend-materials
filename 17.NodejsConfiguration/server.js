require('dotenv').config({ quiet: true });
const express = require('express');
const configureCors = require('./middleware/corsconfiguration');
//global error handler
//url versioning
//rate limiting
//addtimestamp to request
// request logging

const app = express();
const PORT = process.env.PORT || 3000;

//middleware
app.use(configureCors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//routes


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});