import mongoose, { Schema } from "mongoose"


const LikeSchema = new mongoose.Schema({
video:{
  type:Schema.Types.ObjectId,
  ref:"Video"
},
Comment:{
type:Schema.Types.ObjectId,
ref:"Comment"
},
tweet:{
type:Schema.Types.ObjectId,
ref:"Tweet"
},
likedby:{
type:Schema.Types.ObjectId,
ref:"User"
}

},{
  timestamps:true
}) 

export const Like = mongoose.model("Like",LikeSchema)