import express from "express";
const app = express()
import cookieParser from "cookie-parser";
import cors from 'cors'
import userrouter from "./src/routes/user.route.js";
import tweetsrouter from "./src/routes/tweet.route.js"
import likesrouter from "./src/routes/like.route.js";
import playlistrouter from "./src/routes/playlist.route.js"
import commentsrouter from "./src/routes/comment.route.js"
import videorouter from "./src/routes/videos.route.js"
app.use(cors({
origin :process.env.CORS_ORIGIN,
credentials:true

}))

app.use(express.json({limit:"20kb"}))
app.use(express.urlencoded({extended:true,limit:"20kb"}))
app.use(express.static("public"))
app.use(cookieParser());

app.use("/api/v1/users",userrouter)

app.use("/api/v1/tweet",tweetsrouter)
app.use("/api/v1/videos",videorouter)
app.use("/api/v1/likes",likesrouter)
app.use("/api/v1/playlist",playlistrouter)
app.use("/api/v1/comment",commentsrouter)

export default app
   


