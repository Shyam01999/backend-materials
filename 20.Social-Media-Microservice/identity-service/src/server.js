require('dotenv').config();
const express = require('express');
const connectToDB = require('./database/db');
const identityRouter = require('./routes/identity.route');
const errorHandler = require('./middlewares/errorHandler');
const logger = require('./utils/logger');
const helmet = require('helmet');
const configureCors = require('./config/corsConfig');
const { requestLogger } = require('./middlewares/requestLogger');
const { RateLimiterRedis } = require("rate-limiter-flexible");
const Redis = require('ioredis');
const { rateLimit } = require("express-rate-limit");
const { RedisStore } = require("rate-limit-redis")



const app = express();
const PORT = process.env.PORT || 3001;



const redisClient = new Redis(process.env.REDIS_URL)

// Middlewares
// app.use(requestLogger);
app.use(helmet());
app.use(configureCors());
app.use(express.json());


//DDos protection and rate limiting
const rateLimiter = new RateLimiterRedis({
    storeClient: redisClient,
    keyPrefix: "middleware",
    points: 10,
    duration: 1
});

app.use((req, res, next) => {
    rateLimiter
        .consume(req.ip)
        .then(() => next())
        .catch(() => {
            logger.warn(`Rate limit exceeded for IP: ${req.ip}`);
            res.status(429).json({ status: false, message: "Too many requests" });
        });
})

//ip based rate limiting for sensitive end points
const sensitiveEndPointLimiting = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 50,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        logger.warn(`Sensitive endpoint rate limit exceeded for IP: ${req.ip}`);
        res.status(429).json({ status: false, message: "Too many requests" })
    },
    store: new RedisStore({
        sendCommand: (...args) => redisClient.call(...args),
    }),
});

//apply this sensitive endpoint to the route
app.use('/api/auth/register', sensitiveEndPointLimiting)


// Routes
app.use('/api/auth', identityRouter);

// Error handling middleware
app.use(errorHandler);

// Start the server
app.listen(PORT, async() => {
    logger.info(`Identity service is running on port ${PORT}`);
    await connectToDB();
});

//unhandled promise rejection
process.on('unhandledRejection', (reason, promise) => {
    logger.error(`Unhandled Rejection at`, promise, "reason:", reason)
})

