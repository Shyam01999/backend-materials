const Image = require("../models/image.model");
const { uploadToCloudinary } = require("../utils/cloudinaryHelper");
const fs = require("fs");
const cloudinary = require("../config/cloudinary")

const imageUpload = async (req, res) => {
    try {
        //check if the file missing in req object   
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "file is required. Please upload an image"
            })
        }

        //upload to cloudinary
        const { url, publicId } = await uploadToCloudinary(req.file.path);

        //store the image url and public id along with the uploaded user id in the database
        const newUploadedImage = new Image({
            url: url,
            publicId: publicId,
            uploadedBy: req.user._id || "123",
        });

        await newUploadedImage.save();

        //delete the image from uploads
        fs.unlinkSync(req.file.path)

        res.status(201).json({
            success: true,
            message: "Image uploaded successfully",
            image: newUploadedImage
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

const getAllImage = async (req, res) => {
    try {
        const allImagedata = await Image.find();

        if (!allImagedata) {
            return res.status(404).json({
                success: false,
                message: "No Images available"
            });
        }

        res.status(200).json({
            success: true,
            message: "List of all Images",
            data: allImagedata
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Something went very wrong ! please try again"
        })
    }
}

const deleteImage = async (req, res) => {
    try {
        const getCurrentIdOfImageToBeDeleted = req.params.id;
        const { _id } = req.user;
        const image = await Image.findById(getCurrentIdOfImageToBeDeleted);

        if (!image) {
            return res.status(404).json({
                success: false,
                message: "Image not found with this id"
            });
        }

        //check if this is uploaded by the current user who is trying to delete this image
        if (image.uploadedBy.toString() !== _id.toString()) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to delete this image because you are not uploaded it."
            });
        }

        //delete this image first from your cloudinary storage
        await cloudinary.uploader.destroy(image.publicId);

        //delete the image from mobgodb database
        await Image.findByIdAndDelete(getCurrentIdOfImageToBeDeleted);

        res.status(200).json({
            success: true,
            message: "Image deleted successfully"
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Something went very wrong ! please try again"
        })
    }
}

const getImagePagination = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 5;
        const skip = (page - 1) * pageSize;

        const sortBy = req.query.sortBy || 'createdAt';
        const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
        const totalImages = await Image.countDocuments();
        const totalPages = Math.ceil(totalImages / pageSize);

        const sortObj = {};
        sortObj[sortBy] = sortOrder
        const images = await Image.find().sort(sortObj).skip(skip).limit(pageSize);

        if(images){
            res.status(200).json({
                success:true,
                currentpage:page,
                totalPages:totalPages,
                totalImages:totalImages,
                data:images,
                
            })
        }else{
            res.status(404).json({
                success:false,
                message:"No images found"
            })
        }

    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Something went very wrong !Please try again"
        })
    }
}

module.exports = {
    imageUpload,
    getAllImage,
    deleteImage,
    getImagePagination,
}