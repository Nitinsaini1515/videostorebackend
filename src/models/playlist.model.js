import { model, Mongoose, Schema } from "mongoose"


const PlaylistSchema = new mongoose.Schema({
  name:{
    type:String,
    required:true
  },
  owner:{
type:Schema.Types.ObjectId,
ref:"User"
  },
  videos:{
    type:Schema.Types.ObjectId,
    ref:"Video"
  },
  description:{
    type:String,
    required:true
  }

},
{Timestamp:true})

export const Playlist = Mongoose.model("Playlist",PlaylistSchema)