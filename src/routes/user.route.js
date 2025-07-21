import { Router } from "express";
import {LoginUser, LogoutUser, RegisterUser} from "../controller/user.controller.js";
import {upload} from '../middleware/multer.middlieware.js'
import verifyJwt from "../middleware/auth.middleware.js";
const router = Router()

router.route("/register").post(
  upload.fields([
{
name :"avatar",
maxCount:1
},
{
name:"coverimage",
maxCount:1
}
  ]),
  RegisterUser

)
router.route("/login").post(LoginUser)
router.route("/logout").post(verifyJwt,LogoutUser)
export default router