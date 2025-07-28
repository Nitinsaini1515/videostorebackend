import { Router } from "express";
const router = Router()

import verifyJWT from "../middleware/auth.middleware";
import { getLikedComments, getLikedTweets, getLikedVideos, toggleCommentLike, toggletweetLike, togglevideoLike } from "../controller/like.controller";

router.route("/like-comment/:CommentId").post(verifyJWT,toggleCommentLike)
router.route("/like-video/:videoId").post(verifyJWT,togglevideoLike)
router.route("/like-tweet/:tweetId").post(verifyJWT,toggletweetLike)
router.route("/get-liked-comments").get(verifyJWT,getLikedComments)
router.route("/get-liked-tweets").get(verifyJWT,getLikedTweets)
router.route("/get-liked-videos").get(verifyJWT,getLikedVideos)
export default router
