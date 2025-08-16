const cors = require('cors');

const allowedOrigins = ['http://localhost:3000', 'http://example.com'];

const configureCors = () => {
    return cors({
        //origin -> this will tell which origin you wan to user can access your API
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.indexOf(origin) !== -1) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'Accept-version'],
        exposedHeaders: ['X-Total-Count','Content-Range'],
        credentials: true, // enable support for cookies
        maxAge: 600, // cache preflight response for 10 minutes
        preflightContinue: false,
        optionsSuccessStatus: 204
    })
}

module.exports = configureCors;