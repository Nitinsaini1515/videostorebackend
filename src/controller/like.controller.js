import ApiErrors from "../utils/apierror.js";
import ApiRsponse from "../utils/apiresponse.js";
import asynchandler from "../utils/asynchandler.js";
import {Like} from "../models/like.model.js"
import { Comment } from "../models/comment.model.js";
import {Tweet} from "../models/tweet.model.js"
import {Video} from "../models/videos.models.js"


export const toggleCommentLike = asynchandler(async(req,res)=>{
  const {CommentId} = req.params
  const user = req.user._id
  const comment = await Comment.findById(CommentId)
  if(!comment){
    throw new ApiErrors(403,"There is no comment exsist with this id")
  }

  const existingLike = await Like.findOne({
Comment:CommentId,
likedby:user
  })
  if(existingLike){
    await existingLike.deleteOne()
    return res.status(200).json(new ApiRsponse (200,{message:"The video is unliked"}))
  }

await Like.create({
  Comment:CommentId,
  likedby:user
})
return res.status(200).json(new ApiRsponse(200,{message:"Commnet liked"}))

})
export const togglevideoLike = asynchandler(async(req,res)=>{
const {videoId} = req.params
const user = req.user?._id
const video = await Video.findById(videoId)
if(!video){
  throw new ApiErrors(403,"Video with this id is not exsist")
}
const videoLiked = await Like.findOne({
  video:videoId,
  likedby:user
})

if(videoLiked){
  await videoLiked.deleteOne()
  return res.status(200).json(new ApiRsponse(200,{message:"video is unliked"}))
}
await Like.create(
  {
      video:videoId,
  likedby:user
  }
)
return res.status(200).json(new ApiRsponse (200,{message :"Video is liked"}))
})
export const toggletweetLike = asynchandler(async(req,res)=>{
const {tweetId} = req.params
const user = req.user._id
const tweet = await Tweet.findById(tweetId)
if(!tweet){
  throw new ApiErrors(403,"No twet exsist with this id")
}
const tweetExisting = await Like.findOne({
  tweet:tweetId,
  likedby:user
}) 
if(tweetExisting){
  await tweetExisting.deleteOne()
  return res.status(200).json(new ApiRsponse(200,{message:
    "Tweet is unliked"
}))
}
await Like.create({
  tweet:tweetId,
  likedby:user
})
return res.status(200).json(new ApiRsponse(200,{message:"Tweet is liked"}))
})
export const getLikedVideos = asynchandler(async(req,res)=>{
    const userId = req.user._id;  
    const likedVideoLikes = await Like.find({
      likedby: userId,
      video: { $ne: null } 
    }).select("video"); 

    if(!likedVideoLikes || likedVideoLikes.length===0){
       res.status(200).json(new ApiRsponse(200,[],"You didn't like any video yet"));
    }
    const videoIds = likedVideoLikes.map(like => like.video);
    const likedVideos = await Video.find({ _id: { $in: videoIds } });
   res.status(200).json(new ApiRsponse(200,{ likedVideos},"Here is your liked videos"));
    
    
})
export const getLikedComments = asynchandler(async(req,res)=>{
const user = req.user._id
const likedComments = await Like.find({
  likedby:user,
  Comment:{$ne:null}
}).select("Comment")
if(!likedComments||likedComments.length===0){
 res.status(200).json(new ApiRsponse(200,[],"You didn't like any comment yet"));

}
const commentIds = likedComments.map(like => like.Comment);
    const tllikedComments = await Comment.find({ _id: { $in:  commentIds } });

    res.status(200).json(new ApiRsponse(200,{ tllikedComments},"Here is your liked videos"));
})
export const getLikedTweets = asynchandler(async(req,res)=>{
const user = req.user._id
const likedTweets = await Like.find({
  likedby:user,
  tweet:{$ne:null}
}).select("Comment")
if(!likedTweets||likedTweets.length===0){
 res.status(200).json(new ApiRsponse(200,[],"You didn't like any tweet yet"));

}
const tweetsIds = likedTweets.map(like => like.tweet);
    const tllikedtweets = await Tweet.find({ _id: { $in: tweetsIds } });

    res.status(200).json(new ApiRsponse(200,{ tllikedtweets},"Here is your liked videos"));
})