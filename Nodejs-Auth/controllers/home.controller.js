const home = async (req, res) => {
    try {
        res.status(200).json({
            success: true,
            message: "Welcome to home page",
            data:req.user
        })
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Something went wrong! Please try again"
        })
    }
}

module.exports = {
    home
}