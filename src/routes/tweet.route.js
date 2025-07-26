import { Router } from "express";
import verifyJWT from "../middleware/auth.middleware";
import { createtweet, deletetweet, gettweet, updatetweet } from "../controller/tweet.controller";
const router = Router()

router.route("/create-Tweet").post(verifyJWT,createtweet)
router.route("/gettweet/:id").get(gettweet)
router.route("/updatetweet/:id").put(verifyJWT,updatetweet)
router.route("/delete-Tweet/:id").delete(verifyJWT,deletetweet)
export default router