import {v2 as cloudinary}  from 'cloudinary'
import fs from 'fs'

cloudinary.config({
  cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
  api_key:process.env.CLOUDINARY_API_KEY,
  api_secret:process.env.CLOUDINARY_API_SECRET
})

const uploadOnCloudinary = async (localfilepath)=>{
  try {
    if(!localfilepath) return null
    cloudinary.uploader.upload(localfilepath,{
      resource_type:"auto"

    })
    console.log("File is uploaded on the cloudinary")
  } catch (error) {
    fs.unlink(localfilepath)// remove the local file paths when the upload on the cloudinary is failed
    return null
  }
}

export default uploadOnCloudinary
