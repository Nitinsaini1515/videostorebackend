import {v2 as cloudinary}  from 'cloudinary'
import { response } from 'express'
import fs from 'fs'

cloudinary.config({
  cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
  api_key:process.env.CLOUDINARY_API_KEY,
  api_secret:process.env.CLOUDINARY_API_SECRET
})

const uploadOnCloudinary = async (localfilepath)=>{
  try {
    if(!localfilepath) return null
   const response = await cloudinary.uploader.upload(localfilepath,{
      resource_type:"auto"

    })
      // fs.unlinkSync(localFilePath);
      // return response
    console.log("File is uploaded on the cloudinary",response.secure_url)
     return {
      url: response.secure_url,
      public_id: response.public_id,
    };
  } catch (error) {
    fs.unlink(localfilepath)
    // remove the local file paths when the upload on the cloudinary is failed
    return null
  }
}

export default uploadOnCloudinary
