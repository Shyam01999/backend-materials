const Image = require("../models/image.model");
const { uploadToCloudinary } = require("../utils/cloudinaryHelper");
const fs = require("fs");

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
            uploadedBy: req.user || "123",
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

module.exports = {
    imageUpload,
    getAllImage,

}