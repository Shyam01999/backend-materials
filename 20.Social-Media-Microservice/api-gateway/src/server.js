require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const Redis = require('ioredis');
const logger = require('./utils/logger');
const configureCors = require('./config/corsConfig');
const errorHandler = require('./middlewares/errorHandler');
const { requestLogger } = require('./middlewares/requestLogger');
const { rateLimit } = require('express-rate-limit');
const {RedisStore} = require('rate-limit-redis');
const proxy = require('express-http-proxy');

const app = express();
const PORT = process.env.PORT || 3000;

const redisClient = new Redis(process.env.REDIS_URL);


//Middlewares
app.use(helmet());
app.use(configureCors());
app.use(express.json());
app.use(requestLogger)


//rate limiting

const ratelimit = rateLimit({
    windowMs: 15 * 60 * 1000, //15 min
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        logger.warn(`Sensitive endpoint rate limit exceeded for IP: ${req.ip}`);
        res.status(429).json({ message: 'Too many requests.' })
    },
    store: new RedisStore({
        sendCommand: (...args) => redisClient.call(...args),
    }),
})

//proxy routes
// const proxyOptions = {
//     proxyReqPathResolver: (req) => {
//         return req.originalUrl.replace(/^\/v1/, '/api')
//     },
//     proxyErrorHandler: (err, res, next) => {
//         logger.error(`Proxy error: ${err.message}`);
//         res.status(500).json({
//             message: 'Proxy error',
//             error: err.message
//         })
//     }
// }

const proxyOptions = {
    proxyReqPathResolver: (req) => {
        return req.originalUrl.replace(/^\/v1/, '/api')
    },
    proxyErrorHandler: (err, res, next) => {
        logger.error(`Proxy error: ${err.message}`);
        
        // Check if the error is due to the service being down
        if (err.code === 'ECONNREFUSED' || err.message.includes('connect ECONNREFUSED')) {
            return res.status(503).json({
                message: 'Identity service is currently unavailable. Please try again later.',
            });
        }
        
        // For other proxy errors, send a generic error message
        return res.status(500).json({
            message: 'Proxy error',
            error: err.message
        });
    },
    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
        proxyReqOpts.headers["Content-Type"] = "application/json";
        proxyReqOpts.timeout = 5000;
        return proxyReqOpts;
    },
    userResDecorator: (proxyRes, proxyResData, userReq, userRes) => {
        logger.info(`Response received from Identity Service for ${userReq.method} ${userReq.originalUrl} with status code ${proxyRes.statusCode}`);
        return proxyResData;
    },
};

//setting up proxy for different services
app.use('/v1/auth', proxy(process.env.IDENTITY_SERVICE_URL, proxyOptions));

app.use(errorHandler)

app.listen(PORT, () => {
    logger.info(`Api Gateway is running on PORT ${PORT}`);
    logger.info(`Identity Service is running on PORT ${process.env.IDENTITY_SERVICE_URL}`);
    logger.info(`Redis Url ${process.env.REDIS_URL}`)
})



