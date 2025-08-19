//custom error handler

class APIError extends Error {
    constructor(message, statusCode){
        super(message);
        this.statusCode = statusCode;
        this.name = "APIError"; //set the error type to API Error
    }

}

const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next)
}

const globalErrorHandler = (err, req, res, next) => {
    console.error(err.stack);

    if(err instanceof APIError){
        return res.status(statusCode).json({
            status:"error",
            message: err.message
        })
    }

    //handle mongoose handler
    else if(err.name === 'ValidationError'){
        return res.status(400).json({
            status:"error",
            message: "Validation Error",
        })
    }

    else{
        return res.status(500).json({
            status:"error",
            message:"An unexpected error occurred"
        })
    }
}

module.exports = {
    APIError,
    asyncHandler,
    globalErrorHandler
}