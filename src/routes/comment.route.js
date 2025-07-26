import { Router } from "express";

import { CreateComment, DeleteComment, UpdatComment, VideoComment } from "../controller/comment.controller";
import verifyJWT from "../middleware/auth.middleware";

const router = Router()

router.route("/video-comment/:videoId").post(verifyJWT,VideoComment)
router.route("/Create-Comment/:videoId").post(verifyJWT,CreateComment)
router.route("Update/:id").post(verifyJWT,UpdatComment)
router.route("/Delete-Comment/:id").post(verifyJWT,DeleteComment
)
export default router