const multer = require("multer");
const path = require("path");

//set our multer storage
const storage = multer.diskStorage({
    destination:function(req, file, cb){
        cb(null, 'uploads/' )
    },
    filename:function(req, file, cb){
        cb(null, file.originalname + "-" + Date.now() + path.extname(file.originalname))
    }
});

const checkFileFilter = (req, file, cb) => {
    if(file.mimetype.startsWith('image')){
        cb(null, true)
    }else{
        cb(new Error('Not an image ! Please upload only images'))
    }
}

// Initialize multer with the configuration
const upload = multer({
    storage: storage,
    fileFilter: checkFileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB file size limit
    }
});

module.exports = upload