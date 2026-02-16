const TryCatch = (handler) => {
    return async(req, res, next) => {
        try {
            await handler(req, res, next)
        }
        catch (error) {
            console.log(error);
            res.status(500).json({
                success: false,
                message: error.message || `Something went wrong Please try again`
            })
        }
    }

}

export default TryCatch;