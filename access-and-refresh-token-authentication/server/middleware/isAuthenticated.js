const AppError = require("../utils/appError");
const { verifyJWTToken, refreshTokens, sendAcessTokenAndRefeshToken } = require("../utils/authHelper");
const TryCatch = require("../utils/TryCatch");

const isAuthenticated = TryCatch(async (req, res, next) => {
    const accessToken = req.cookies.access_token;
    const refreshToken = req.cookies.refresh_token;

    if (!accessToken && !refreshToken) {
        return next(new AppError(`Please login to access this route`, 401))
    }
    
    if (accessToken) {
        const decodedToken = verifyJWTToken(accessToken);   
        if(!decodedToken){
            return next(new AppError(`Access denied! Please provide the correct token to login`, 401))
        }
        req.user = decodedToken;
        return next();
    }

    if (refreshToken) {
        // const decodedToken = verifyJWTToken(accessToken);
        const { newaccessToken, newrefreshToken, user } = await refreshTokens(refreshToken)
        req.user = user;
        sendAcessTokenAndRefeshToken(res, newaccessToken, newrefreshToken);
        return next();
    }

    return next();
});

module.exports = { isAuthenticated }