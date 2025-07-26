import ApiErrors from ".././utils/apierror.js"
import { Comment} from "../models/comment.model.js"
import ApiResponse from ".././utils/apiresponse.js"
// import {User} from "../middleware/auth.middleware"
import {Video} from "../models/videos.models.js"
// import { Comment } from "../models/comment.model.js"
import {User} from "../models/user.models.js"
import asynchandler from ".././utils/asynchandler.js"
import { response } from "express"


export  const VideoComment = asynchandler(async(req,res)=>{
 const {videoId} = req.params
    const {page = 1, limit = 10} = req.query
const comment = await Comment.find({video:videoId})
.populate("owner","username")
   .skip((page - 1) * limit)
    .limit(parseInt(limit));

    if(comment.length === 0){
      throw new ApiErrors(400,"there is an error in the comments")
    }
    return res.status(200).json(new ApiResponse (200,comment,"getting the video"))
})

export const CreateComment = asynchandler(async(req,res)=>{
const {content} = req.body
const{videoId} = req.params
const user = req.user._id //ye main user ki id lega?
if(!videoId){
  throw new ApiErrors (400,"Video id is required")
}
const exsistngvideo = await Video.findById(videoId)
if(!exsistngvideo){
    throw new ApiErrors(400,"No video exsist with this id")
}
if(!content){
  throw new ApiErrors(400,"Comment should not be empty")
}
const comment = await Comment.create(
  {
    content,
owner:user,
video:videoId
  }
)
if(!comment){
  throw new ApiErrors(402,"there is error in comment")
}
return res.status(200).json(new ApiResponse(200,comment,"comment  done"))
})


export const UpdatComment = asynchandler(async(req,res)=>{
  const {id} = req.params
  const{content} = req.body
  const comment = await Comment.findById(id)

  if(!id){
    throw new ApiErrors(401,"id is req is required")
  }
  if(!content)
  {
     throw new ApiErrors(401,"content is required")

  }
  if(!comment){
    throw new ApiErrors(401,"comment is required")
  }
  if(comment.owner.toString()!==req.user._id.toString()){
     throw new ApiErrors(402,"No id match")
  }
  comment.content = content||comment.content
  await comment.save()
  return res.status(200).json(new ApiResponse(200,comment,"comment  done"))
})

export const DeleteComment = asynchandler (async(req,res)=>{
  const {commentId} = req.params;
  const comment = await Comment.findById(commentId)
if(!(commentId&&comment)){
  throw new ApiErrors(401,"Comment id is required")
}

if(comment.owner.toString()!==req.user._id.toString()){
 throw new ApiError(403, "unauthorized user");}
await comment.remove()
return res.status(200).json(new ApiResponse(200,null,"Comment is deleted"))
})
