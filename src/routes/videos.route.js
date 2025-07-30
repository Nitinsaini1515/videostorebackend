import { Router } from "express";
import verifyJWT from "../middleware/auth.middleware";
import { deleteVideo, getAllVideos, getVideoById, publishAVideos, togglePublishStatus, updateThumnail } from "../controller/video.controller";
import { upload } from "../middleware/multer.middlieware";
const router = Router()

router.route("/getallvideos").get(verifyJWT,getAllVideos)
router.route("/publishvideo").post(verifyJWT,(upload.fields([
  {
    name:"videofile",
    maxCount:1
  },
  {
    name:"thumbnail",
    maxCount:1
  }
])),publishAVideos)

router.route("/getvideobyid/:videoId").get(verifyJWT,getVideoById)
router.route("/update-disc-title/:videoId").post(verifyJWT,updatecdesc)
router.route("/update-thumbnail/:videoId").post(verifyJWT,updateThumnail)
router.route("/delete-video/:videoId").post(verifyJWT,deleteVideo)
router.route("toggle-video/:videoId").post(verifyJWT,togglePublishStatus)

export default router