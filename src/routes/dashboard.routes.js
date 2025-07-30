import verifyJWT from "jsonwebtoken"
import { Router } from "express"
import { getAllVideos, getChannelStats } from "../controller/dashboard.controller"
const router = Router()

router.route("/getchannelstats").get(verifyJWT,getChannelStats)
router.route("/getallvideos").get(verifyJWT,getAllVideos)
export default router