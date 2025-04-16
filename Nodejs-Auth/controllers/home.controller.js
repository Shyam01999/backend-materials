const home = async(req, res) => {
    try{

    }
    catch(error){
        console.log(error);
        res.status(500).json({
            success:false,
            message:"Something went wrong! Please try again"
        })
    }
}

module.exports = {
    home
}