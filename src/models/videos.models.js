import mongoose, { mongo } from "mongoose";
import mongooseaggregate from 'mongoose-aggregate-paginate-v2'
const videosSchema = mongoose.Schema(
  {
    videofile: {
      type: String, //cloudnary
      required: true,
    },
    thumbnail: {
         type: String, //cloudnary
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true, //cloudnary
    },
    views: {
      type: Number,
      default: 0,
    },
    ispublished: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);
videosSchema.plugin(mongooseaggregate)

export const Video = mongoose.model("Video", videosSchema);
