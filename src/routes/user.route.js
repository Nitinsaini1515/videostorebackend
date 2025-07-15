import { Router } from "express";
import RegisterUser from "../controller/user.controller.js";
import {upload} from '../middleware/multer.middlieware.js'
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

export default router