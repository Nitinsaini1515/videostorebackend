import asynchandler from "../utils/asynchandler";
import ApiErrors from "../utils/apierror";
import { Playlist } from "../models/playlist.model";
import ApiResponse from "../utils/apiresponse";
import { User } from "../models/user.models";
import { Video } from "../models/videos.models";

export const PlaylistCreate = asynchandler(async(req,res)=>{
  const{name,description} = req.body
  const user = req.user._id
  // const user = req.user._id
  // const {videoId} = req.params
  if(!(name&&description)){
    throw new ApiErrors(402,"name and description field require")
  }

  const playlist = await Playlist.create({
    name,
    description,
    owner:user
  })
if(!playlist){
  throw new ApiErrors(402,"Playlist not be created")
}
return res.status(200).json(new ApiResponse(200,playlist,"playlist is created"))
})

export const GetUserPlaylist = asynchandler(async(req,res)=>{
  const userId = req.user._id;
  const userplaylist = await Playlist.find({owner:userId}).populate("videos")

if(!userplaylist||userplaylist.length == 0){
 return res.status(401).json(new ApiResponse (401,[],"."))
}
return res.status(200).json(new ApiResponse(200,userplaylist,"here is your playlist"))
})

export const GetPlaylistById = asynchandler(async(req,res)=>{
  const userId = req.params
  if(!userId){
    throw new ApiErrors(402,"Userid must be filled")
  }
  const Findingplaylist = await Playlist.findById(userId).populate("videos").populate("owner","username")
  if(!Findingplaylist){
    throw new ApiErrors(402,"Playlist not be founded")
  }
  return res.status(200).json(new ApiResponse(200,Findingplaylist,"your playlist is here"))
})

export const AddVideoIntoPlaylist= asynchandler(async(req,res)=>{

})

export const RemoveVideoFromPlaylist = asynchandler(async(req,res)=>{

})
export const UpdatePlaylist= asynchandler(async(req,res)=>{

})
export const DeletePlaylist= asynchandler(async(req,res)=>{

})

