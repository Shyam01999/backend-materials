import crypto from "crypto";
import { redisClient } from "../index";

const options = {
    httpOnly: false,
    secure: isProduction ? process.env.COOKIE_SECURE === "true" && true : true, //CSRF(Cross site request forgery)
    sameSite: process.env.COOKIE_SAME_SITE, //XSS Attack
    path: '/',
};

const generateCSRFToken = async (userId, res) => {
    const csrfToken = crypto.randomBytes(32).toString("hex");

    const csrfkey = `csrf:${userId}`;

    await redisClient.setEx(csrfkey, 3600, csrfToken);

    res.cookie('csrfToken', csrfToken, {
        ...options,
        maxAge: Number(process.env.COOKIE_CSRF_TOKEN_EXPIRES) * 60 * 1000
    });

    return csrfToken;
}

const verifyCSRFToken = async (req, res, next) => {
    try {
        if (req.method == "GET") {
            return next();
        }

        const userId = req.user.id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "User not authenticated"
            })
        }

        const clientToken = req.headers["x-csrf-token"] || req.headers["x-xsrf-token"] || req.headers["csrf-token"];

        if (!clientToken) {
            return res.status(403).json({
                success: false,
                message: "CSRF Token missing. Please refresh the page.",
                code: "CSRF_TOKEN_MISSING"
            })
        }

        const csrfKey = `csrf:${userId}`;

        const storedToken = await redisClient.get(csrfKey);

        if (!storedToken) {
            return res.status(403).json({
                success: false,
                message: "CSRF Token Expired. Please try again",
                code: "CSRF_TOKEN_EXPIRED"
            })
        }


        if (clientToken !== storedToken) {
            return res.status(403).json({
                success: false,
                message: "Invalid CSRF Token. Please refresh the page.",
                code: "CSRF_TOKEN_INVALID"
            })
        }

        next()
    }
    catch (error) {
        console.log("CSRF verification error", error)
        return res.status(500).json({
            success: false,
            message: "CSRF Verification failed.",
            code: "CSRF_VERIFICATION_ERROR"
        })
    }

}

const revokeCSRFToken = async (userId) => {
    const csrfKey = `csrf:${userId}`;

    await redisClient.del(csrfKey);
}

const refreshCSRFToken = async (userId, res) => {
    await revokeCSRFToken();

    return await generateCSRFToken(userId, res)
}

export {
    generateCSRFToken,
    verifyCSRFToken,
    revokeCSRFToken,
    refreshCSRFToken,
}



