import { Router } from "express";
import {
  AvatarChange,
  GetCurrentUser,
  getUserChannelProfile,
  LoginUser,
  LogoutUser,
  PasswordChange,
  RefreshAccessToken,
  RegisterUser,
  UpdateCoverimage,
  UsernameChange,
  WatchHistory,
} from "../controller/user.controller.js";
import { upload } from "../middleware/multer.middlieware.js";
import verifyJwt from "../middleware/auth.middleware.js";
const router = Router();

router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverimage",
      maxCount: 1,
    },
  ]),
  RegisterUser
);
router.route("/login").post(LoginUser);
router.route("/logout").post(verifyJwt, LogoutUser);
router.route("/refreshtoken").post(RefreshAccessToken);
router.route("change-password").post(verifyJwt, PasswordChange);
router.route("/current-user").get(verifyJwt, GetCurrentUser);
router.route("avatar").patch(verifyJwt, upload.single("avatar"), AvatarChange);
router
  .route("cover-image")
  .patch(verifyJwt, upload.single("coverimage"), UpdateCoverimage);
router.route("/name-change").post(verifyJwt, UsernameChange);
router.route("/c/:username").get(verifyJwt, getUserChannelProfile);
router.route("history").get(verifyJwt, WatchHistory);
export default router;
