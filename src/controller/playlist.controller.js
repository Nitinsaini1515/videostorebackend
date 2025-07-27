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
const {PlaylistId,VideoId} = req.params
const playlsit = await Playlist.findById(PlaylistId)

if(!playlsit){
  throw new ApiErrors(402,"No playlist exsit")
}
const video = await Video.findById(VideoId)
if(!video){
  throw new ApiErrors(402,"No video exist exsit")
}
// checking already exsist in playlist

const alreadyExsist = await playlist.videos.some((vid)=>vid.toString()=== VideoId)
if(alreadyExsist){
  return res.status(200).json(new ApiResponse (200,playlist,"video is already part of playlist"))

}
 if (!playlist.videos.includes(videoId)){
playlist.videos.push(VideoId)
await playlist.save()}
return res.status(200).json(new ApiResponse(200,playlist,"video is added to playlist"))


})

export const RemoveVideoFromPlaylist = asynchandler(async(req,res)=>{

  const {playlistId,VideoId} = req.params

  const playlist = await Playlist.findById(playlistId)
  if(!playlist){
     throw new ApiErrors(403,"This playlist does not exist")
  }
  const video = await Playlist.findById(VideoId)

  if(!video){
    throw new ApiErrors(403,"This video does not exist in playist")
  }

    const exists = playlist.videos.some(
    (vid) => vid.toString() === videoId
  );
  if (!exists) {
    throw new ApiErrors(403, "This video is not in the playlist");
  }

playlist.videos.pull(VideoId)
await playlist.save()
return res.status(200).json(new ApiResponse(200,playlist,"video is removed from playlist"))

})
export const UpdatePlaylist= asynchandler(async(req,res)=>{
  const {playlistId} = req.params
const name = req.body
const description = req.body

if(!name||!description){
  throw new ApiErrors(403,"All fields are not filled")
}
const playlist = await Playlist.findById(playlistId)
if(!playlist){
 throw new ApiErrors(403,"No playlist exsist with this id")

}
playlist.name = name||playlist.name
playlist.description = description|| playlist.description
await playlist.save()

return res.status(200).json(new ApiResponse(200,playlist,"playlist is updated"))
})

export const DeletePlaylist= asynchandler(async(req,res)=>{
const {playlistId} = req.params
const playist = await Playlist.findByIdAndDelete(playlistId)
if(!playist){
   throw new ApiErrors(403,"playlist already does not exist ")

}
return res.status(200).json(new ApiResponse(200,{},"playlist is deleted"))
})

