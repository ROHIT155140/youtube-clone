import { V2 as cloudinary } from 'cloudinary';
import fs from 'fs'

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null

        //upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })

        // the file has been uploaded successfully on cloudinary
        console.log(`the file has been uploaded successfully on cloudinary ${response.url}`)
        return response
    } catch (error) {
        fs.unlinkSync(localFilePath) // remove file from the server which is temparly saved on the server 

        return null


    }

}

export { uploadOnCloudinary }