
import {Video} from "../models/videos.models.js"
import ApiErrors from "../utils/apierror.js";
import ApiRsponse from "../utils/apiresponse.js";
import asynchandler from "../utils/asynchandler.js";

export const getAllVideos = asynchandler(async(req,res)=>{
  // const {videoId} = req.params
  const video = await Video.find()
  if(!video || video.length ===0){
    throw new ApiErrors(4020,"No video exsist")
  } 
  return res.status(200).json(new ApiRsponse(200,video,"Video if founded"))
})

export const publishAVideos = asynchandler(async(req,res)=>{
  const {description,title} = req.body
  const {owner} = req.user?._id
  if([description,title].some((field)=>field.trim() ==="")){
    throw new ApiErrors(403,"All field are required")
  }
  const videofile = req.files?.videofile?.[0]?.path
  const thumbnail = req.files?.thumbnail?.[0]?.path
  if(!thumbnail ||!videofile)
  {
    throw new ApiErrors(200,"Video and thumbnsil are required")
  }
  const newvideo = await Video.create({
    videofile,
    title,
    thumbnail,
    description,
    videofile,
    owner,
    ispublished:ispublished||true
    
  })
  return res.status(200).json(new ApiRsponse
   (200,newvideo,"Video is uploaded") 
  )
})
export const getVideoById = asynchandler(async(req,res)=>{
const {videoId} = req.params
const video = await Video.findById(videoId)
if(!video){
  throw new ApiErrors(402,"No video exist with this id")
}
return res.status(200).json(new ApiRsponse(200,video,"Here is your video"))
})

export const updatecdesc = asynchandler(async(req,res)=>{
const {description,title} = req.body
const {videoId} = req.params
const video = await Video.findById(videoId)
const user =req.user._id
if(!video){
  throw new ApiErrors(403,"No video exist with this id")
}
if(video.owner.toString()!==user.toString()){
  throw new ApiErrors(200,"Unauthorized request")
}
if(description) video.description = description
if(title) video.title =title
await video.save()
res.status(200).json(new ApiRsponse(200,video,"Here is your updated video "))
})

export const updateThumnail = asynchandler(async(req,res)=>{
  const thumbnaillocal = req.files?.thumbnail?.[0].path;
  const user = req.user._id
const {videoId} = req.params
const video = await Video.findById(videoId)
if(!videoId){
  throw new ApiErrors(403,"video does not exsist")
}
  if(video.owner.toString()!== user.toString()){
    throw new ApiErrors(403,"unauthorized request")
  }
  if (!thumbnaillocal) {
    throw new ApiErrors("The thumbnail file is missing");
  }
  const thumbnail = await uploadOnCloudinary(thumbnaillocal);
  if (!thumbnail?.url) {
    throw new ApiErrors(401, "uploadoncloudinary fails");
  }
  await Video.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        thumbnail: thumbnail.url,
      },
    },
    {
      new: true,
    }
  )

  return res.status(200).json( new ApiRsponse(200, {}, "thumbnail changed successfully"));

})
export const deleteVideo = asynchandler(async(req,res)=>{
  const {videoId} = req.params
  const user = req.user._id
  const video = await Video.findById(videoId)
  if(!videoId){
    throw new ApiErrors(402,"No video exsist with this id")
  }
  if(video.owner.toString()!== user.toString()){
    throw new ApiErrors(403,"unauthorized request")
  }
  // await Video.findByIdAndDelete(videoId)
await video.deleteOne()
  return res.status(200).json(new ApiRsponse(200,{},"Video is deleted successfully"))
})

export const togglePublishStatus = 
asynchandler(async(req,res)=>{
  const user = req.user?._id
  const {videoId} = req.params
  const video = await Video.findById(videoId)
  if(!video){
    throw new ApiErrors (403,"Video  does not exist")
  }
  if(video.owner.toString()!=user.toString()){
throw new ApiErrors (403,"Unauthorized request")
  }
  video.ispublished = !video.ispublished
  await video.save()
  return res.status(200).json(new ApiRsponse(200,video,{message:"Video is unlisted "}))
})