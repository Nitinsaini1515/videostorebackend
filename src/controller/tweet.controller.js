import asynchandler from ".././utils/asynchandler.js";
import ApiErrors from ".././utils/apierror.js";
import ApiRsponse from ".././utils/apiresponse.js";
import { User } from "../models/user.models.js";
import { Tweet } from "../models/tweet.model.js";

export const createtweet = asynchandler(async (req, res) => {
  //get username
  // check username exsist or not if it is
  // create delete update get
  const { content } = req.body;
  const user = req.body._id;
  if (!content) {
    throw new ApiErrors(401, "the content in tweet is required");
  }
  const tweet = await Tweet.create({
    content,
    owner: user,
  });
  if (!tweet) {
    throw new ApiErrors(307, "Error to create an tweet");
  }
  return res.status(200).json(new ApiRsponse(200, tweet, "tweet is created"));
});



export const gettweet = asynchandler(async (req, res) => {
  // const user = req.user._id
  const {id} = req.params
  // const { username } = req.params;
  if(!id){
    throw new ApiErrors(370,"No user exsist")

  }
  // if (!username) {
  //   throw new ApiErrors(370, "No user exsist");
  // }
  const tweet = await Tweet.findById(id).populate("owner", "username email");
  if (!tweet) {
    throw new ApiErrors(401, "There is an error of fetchin the tweets");
  }
  return res(200).json(new ApiRsponse(200, tweet, "finnaly get the tweet"));
});



export const updatetweet = asynchandler(async (req, res) => {
const {id} = req.params
const {content} = req.body
// tweet find
// tweet edit

// tweet save
// if(!(id && content)){
//   throw new ApiErrors(401,"There is error in the content or id")
// }
const tweet = await Tweet.findById(id)

if(!tweet){
     throw new ApiErrors(401,"There is error in the tweet finding")
}
if(tweet.owner.toString() !== req.user._id.toString()){
     throw new ApiErrors(401,"unauthorized")
}
tweet.content = content || tweet.content
await tweet.save()
res.status(200).jso(new ApiRsponse(200,tweet,"tweet is updated"))
  // agr tweet esit nhi krta to erro agr krta hai to content ke andar ki value contne wali dal do

});



export const deletetweet = asynchandler(async (req, res) => {
const {id} = req.params
const tweet = await Tweet.findById(id)
if(!tweet){
    throw new ApiError(404, "Tweet not found");
  }
  if(tweet.owner.toString() !== user.req.id.toString()){
      throw new ApiError(403, "unauthorized user");
  }
await tweet.remove()

  return res.status(200).json(200,null,"Tweet is deleted")
});
