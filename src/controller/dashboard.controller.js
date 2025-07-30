import { Video } from "../models/videos.models.js";
import { Like } from "../models/like.model.js";
import {asynhandler} from "../utils/asynchandler.js"
import {apiErrors} from "../utils/apierror.js"
import {ApiResponse} from "../utils/apiresponse.js"
import {User} from "../models/user.models.js"

export const getChannelStats = asyncHandler(async (req, res) => {
  const channelId = req.user._id;

  if(!channelId){
    throw new apiErrors(402,"Channel id should be right")
  }
  const totalVideos = await Video.countDocuments({ owner: channelId });
  const videos = await Video.find({ owner: channelId }, "_id views");

  if(!videos){
        throw new apiErrors(402,"No video found in this channel")
  }
  const totalViews = videos.reduce((sum, video) => sum + (video.views || 0), 0);
  const videoIds = videos.map(video => video._id);
  const totalLikes = await Like.countDocuments({ video: { $in: videoIds } });
  return res.status(200).json(
    new ApiResponse(200, {
      totalVideos,
      totalViews,
      totalLikes
    }, "Channel stats fetched")
  );
});


export const getAllVideos =  asynhandler(async(req,res)=>{
  const ownerId = req.user._id
  const videos = await Video.find({owner:ownerId})
  if(videos.length == 0){
    throw new apiErrors(403,"There is no video exsist ")
  }
  return new res.status(200).json(new ApiResponse(200,videos,"Here is your all videos"))
})