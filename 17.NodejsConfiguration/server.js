require('dotenv').config({ quiet: true });
const express = require('express');
const configureCors = require('./config/corsConfig');
const { globalErrorHandler } = require('./middleware/errorHandler');
const { requestLogger, addTimeStamp } = require('./middleware/customMiddleware');
const { urlVersioning } = require('./middleware/apiVersioning');
const {createBasicRateLimiter} = require('./middleware/rateLimiting');
const itemRoutes = require('./routes/item.route');

const app = express();
const PORT = process.env.PORT || 3000;

//middleware
app.use(requestLogger);
app.use(addTimeStamp);
app.use(configureCors());
app.use(express.json());    
app.use(createBasicRateLimiter(100, 15 * 60 * 1000)); //100 requests per 15 minutes
// app.use(express.urlencoded({ extended: true }));
app.use(urlVersioning('v1'));
app.use(globalErrorHandler);

//routes
app.use('/api/v1', itemRoutes);


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});