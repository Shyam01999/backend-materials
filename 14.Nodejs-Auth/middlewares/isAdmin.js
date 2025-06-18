const isAdmin = (roles) => async (req, res, next) => {
    try {
        const userRole = req.user.role;
        if (!roles.includes(userRole)) {
            return res.status(403).json({
                success: false,
                message: "Admin right required"
            })
        }

        return next();
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Something went wrong! Please try again"
        })
    }
}

module.exports = isAdmin;