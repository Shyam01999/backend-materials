const cors = require('cors');

const allowedOrigins = [
    'http://localhost:3001',
    'http://localhost:3000',
];

const configureCors = () => {
    return cors({
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.indexOf(origin) !== -1) {
                callback(null, true);
            }
            else {
                callback(new Error('Not allowed by CORS'))
            }
        },
        methods:[ 'GET', 'POST', 'PUT', 'DELETE', 'OPTIONS' ],
        allowedHeaders: ['Content-Type', 'Authorization', 'Accept-version'],
        exposedHeaders: ['X-Total-Count','Content-Range'],
        credentials: true,
        maxAge: 600,
        preflightContinue: false,
        optionsSuccessStatus: 204   
    })
}

module.exports = configureCors;