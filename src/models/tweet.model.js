import mongoose, { Schema } from "mongoose"

const TweetSchema = mongoose.Schema({
  owner:{
    type:Schema.Types.ObjectId,
    ref:"User"
  },
  content:{
    type:String,
    required:true
  }

},{Timestamp:true})

export const Tweet = mongoose.model("Tweet",TweetSchema) 