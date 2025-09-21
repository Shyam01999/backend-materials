const logger = require("../utils/logger");

const requestLogger = (req, res, next) => {
    console.log("req", req.method)
    const method = req.method;
    const url = req.url;
    const timestamp = new Date().toISOString();
    
    logger.info(`Request received : ${method} - ${url}`);
    logger.info(`Request Body : ${JSON.stringify(req.body)}`);
    next();

};

module.exports = {
    requestLogger
};