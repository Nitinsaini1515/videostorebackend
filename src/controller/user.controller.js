import asynchandler from "../utils/asynchandler.js";
import ApiErrors from "../utils/apierror.js";
import ApiRsponse from "../utils/apiresponse.js";
import { User } from "../models/user.models.js";
import uploadOnCloudinary from "../utils/coudinary.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
// first we get data from the body using req.body in destructured way
// then check using the .some ki koi field empty to nhi
// check user exsusted or not using findOne if exsist through error
// if not then using req.files.avatar[0].path use krke avatar or coverimage lo
// dono ko error handle kro
// then ek user create kro database me like User.create se
// abb select ka use krke jo save use data ausme se password remove krdo aur refreshtoken
// then return response

const generateAccessaAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accesstoken = user.generateAccessToken();
    const refreshtoken = user.generateRefreshToken();
    // console.log(accesstoken)
    // console.log(refreshtoken)
    user.refreshtoken = refreshtoken;
    await user.save({ validateBeforeSave: false });
    return { accesstoken, refreshtoken };
  } catch (error) {
    throw new ApiErrors(
      500,
      "Something went wrong while generating the access and refresh token"
    );
  }
};
export const RegisterUser = asynchandler(async (req, res) => {
  const { username, email, fullname, password } = req.body;
  // console.log("email",email)
  // get info of the user like name fullname from frontend
  // validation- check all filed no any field is empty
  // if user enter registerd mail then show error
  // if user enter usesrname then show error
  // check for images avtar and images
  // upload them to cloudinary
  // get url of uploaded image from cloudinar
  // no error for coverimage
  // cretae user object  - create in db
  // remove password and refresh token field from response
  // check for user creation if it is then show res if not send error

  // if(fulname === ""){
  //   throw new ApiErrors(400,"Full name is required")
  // }
  if (
    [fullname, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiErrors(400, "All method is required ");
  }
  if (!email.toLowerCase().endsWith("@gmail.com")) {
    throw new ApiErrors(400, "Email should be ends with @gmail.com,@yahoo.com");
  }
  const userexsit = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (userexsit) {
    throw new ApiErrors(300, "Email or password is already exsist");
  }

  const avatarlocal = req.files?.avatar[0]?.path;
  const coverlocal = req.files?.coverimage[0]?.path;
  console.log(avatarlocal);
  console.log(coverlocal);
  // console.log(avatarlocal)
  if (!avatarlocal) {
    throw new ApiErrors("400", "avatar image is required");
  }
  const avatar = await uploadOnCloudinary(avatarlocal);
  // console.log(avatar)
  const coverhandle = await uploadOnCloudinary(coverlocal);
  // console.log(coverhandle)
  if (!avatar) {
    throw new ApiErrors(404, "avatar image is not correct ");
  }
  const mainuser = await User.create({
    fullname,
    avatar: avatar.url,
    coverhandle: coverhandle?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });
  const createduser = await User.findById(mainuser._id).select(
    "-password -refreshtoken"
  );

  if (!createduser) {
    throw new ApiErrors(404, "something error to register a user");
  }
  return res
    .status(200)
    .json(new ApiRsponse(200, createduser, "user is registred succesfully"));
});

export const LoginUser = asynchandler(async (req, res) => {
  // what we have to work
  // get data from user then
  // get data from database
  // match the password and email
  // if match login done give then access token and refresh token
  // if not show error
  const { username, email, password } = req.body;

  if (!(email || username)) {
    throw new ApiErrors(300, "The username or email is required");
  }

  const user = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (!user) {
    throw new ApiErrors(401, "Please enter a valid username or email");
  }
  const ispassvalid = await user.isPasswordCorrect(password);
  if (!ispassvalid) {
    throw new ApiErrors(401, "the pass you entered is not correct");
  }

  const { accesstoken, refreshtoken } = await generateAccessaAndRefreshToken(
    user._id
  );
  const loggedinuser = await User.findById(user._id).select("-password");
  const options = {
    httpOnly: true,
    Secure: true,
  };
  return res
    .status(200)
    .cookie("accesstoken", accesstoken, options)
    .cookie("refreshtoken", refreshtoken, options)
    .json(
      new ApiRsponse(
        200,
        {
          user: loggedinuser,
          accesstoken,
          refreshtoken,
        },
        "User logged in successfully"
      )
    );
});

export const LogoutUser = asynchandler(async (req, res) => {
  User.findByIdAndUpdate(
    await req.user._id,
    {
      $unset: {
        refreshtoken: 1,
      },
    },
    {
      new: true,
    }
  );
  const options = {
    httpOnly: true,
    Secure: true,
  };
  return res
    .status(200)
    .clearCookie("accesstoken", options)
    .clearCookie("refreshtoken", options)
    .json(new ApiRsponse(200, {}, "User logged out"));
});

export const RefreshAccessToken = asynchandler(async (req, res) => {
  const incommingrefreshtoken =
    req.cookies.refreshtoken || req.body.refreshtoken;
  if (!incommingrefreshtoken) {
    throw new ApiErrors(401, "Unauthorized request");
  }
  try {
    const decodedtoken = jwt.verify(
      incommingrefreshtoken,
      process.env.REFRESH_TOKEN_SECRET
    );
    // if(!decodedtoken){
    //   throw new erro
    // }
    const user = await User.findById(decodedtoken?._id);
    if (!usertoken) {
      throw new ApiErrors(401, "Cannot get the usertoken");
    }
    if (incommingrefreshtoken !== user?.refreshtoken) {
      throw new ApiErrors(401, "Refresh token is expired to use");
    }

    const options = {
      httpOnly: true,
      Secure: true,
    };
    const { accesstoken, newrefreshtoken } =
      await generateAccessaAndRefreshToken(user._id);
    return res
      .status(200)
      .cookie("accesstoken", accesstoken, options)
      .cookie("refreshtoken", newrefreshtoken, options)
      .json(
        new ApiRsponse(
          200,
          { accesstoken, refreshtoken: newrefreshtoken },
          "Access token refresheed successfully"
        )
      );
  } catch (error) {
    throw new ApiErrors(401, error?.message || "Invalid response");
  }
});

export const PasswordChange = asynchandler(async (req, res) => {
  const { oldpassword, newpassword, confirmpassword } = req.body;

  if (!(newpassword == confirmpassword)) {
    throw new ApiErrors(401, "Your new and confirm password didn't match");
  }
  if (
    [oldpassword, newpassword, confirmpassword].some(
      (fields) => fields.trim() == ""
    )
  ) {
    throw new ApiErrors(401, "No any password field should not be empty");
  }
  const user = await User.findById(req.user?._id);

  const ispasswordcorrect = await user.isPasswordCorrect(oldpassword);
  if (!ispasswordcorrect) {
    throw new ApiErrors(401, "Enter an correct password");
  }
  user.password = password;
  await user.save({ validateBeforeSave: false });
  return res.status(200).json(200, {}, "password change successfully");
});

export const GetCurrentUser = asynchandler(async (req, res) => {
  return res.status(200).json(200, req.user, "Current user fetched");
});
export const AvatarChange = asynchandler(async (req, res) => {
  // const {newavatar} = req.body;
  //yaha condition laga sakte hai ki avatar png jpg kis format me hona chayea
  //  const checkUser =  await User.findById(user._id)
  // const updating = await checkUser.findByIdAndUpdate()
  //  const
  // user se file li multer ke through then locally  save ki then ausko cloudinary pe dala and waha se url iya and database me dal diya
  const avatarlocalpaath = req.files?.path;
  if (!avatarlocalpaath) {
    throw new ApiErrors("The avatar file is missing");
  }
  const avatar = await uploadOnCloudinary(avatarlocalpaath);
  if (!avatar.url) {
    throw new ApiErrors(401, "uploadoncloudinary fails");
  }
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        avatar: avatar.url,
      },
    },
    {
      new: true,
    }
  ).select("-password");

  return res.status(200).json(200, {}, "avatar changed successfully");
});

export const UpdateCoverimage = asynchandler(async (req, res) => {
  const localcoverimage = req.file?.path;
  if (!localcoverimage) {
    throw new ApiErrors(300, "There is an error in localcoverimage");
  }
  const coverimage = await uploadOnCloudinary(localcoverimage);
  if (!coverimage.url) {
    throw new ApiErrors(402, "failed to upload");
  }
  const coverimageupload = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        coverimage: coverimage.url,
      },
    },
    {
      new: true,
    }
  ).select("-password");

  if (!coverimageupload) {
    throw new ApiErrors(401, "cover image cannot be setted");
  }
  return res.status(200).json(200, {}, "Cover image changed successfully");
});
export const UsernameChange = asynchandler(async (req, res) => {
  const { fullname, username } = req.body;
  if (fullname == "" && username == "") {
    throw new ApiErrors(401, "All fields are required");
  }
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        username: username,
      },
    },
    {
      new: true,
    }
  ).select("-password");
  return res
    .status(200)
    .json(new ApiRsponse(200, user, "username changed successfully"));
});

export const getUserChannelProfile = asynchandler(async (req, res) => {
  const { username } = req.params;
  if (!username?.trim()) {
    throw new ApiErrors(401, "no user exsist");
  }
  const channel = await User.aggregate([
    {
      $match: {
        username: username?.toLowerCase(),
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "channel",
        as: "subscribers",
      },
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "subscriber",
        as: "subscribeto",
      },
    },
    {
      $addFields: {
        subscribercount: {
          $size: "$subscribers",
        },
        channelsubscribedtocount: {
          $size: "subscribeto",
        },
        issubscribed: {
          $cond: {
            if: {
              $in: [req.user?._id, "$subscribers.subscriber"],
            },
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $project: {
        fullname: 1,
        username: 1,
        subscribercount: 1,
        channelsubscribedtocount: 1,
        issubscribed: 1,
        avatar: 1,
        coverimage: 1,
        email: 1,
      },
    },
  ]);
  if (!channel?.length) {
    throw new ApiErrors(401, "No channel exsist");
  }
  // console.log(channel)
  return res
    .status(200)
    .json(new ApiRsponse(200, channel[0], "Channel fetched"));
});

// for subscriber we count document means channels
// man lo agar aapke pass 100 documents hai aur kisi condition ke bad hamne kaha ki aisko 50 kardo to next stage ke liye wo 50 document hi wo orignal data set hai
export const WatchHistory = asynchandler(async (req, res) => {
  const user = User.aggregate([
    {
      $match: {
        id: new mongoose.Types.ObjectId(req.user._id),
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "watchhistory",
        foreignField: "_id",
        as: "watchhistory",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as:"owner",
              pipeline:[
                {
                  $project:{
                    fullname :1,
                    username:1,
                    avatar:1
                  }
                }
              ]
            },
          },
        ],
      },
    },
    {
      $addFields:{
        owner:{
          $first:"$owner"
        }
      }
    }
  ]);
  return res.status(200).json(new ApiRsponse (200,user[0].watchhistory,"watch history getched"))
});
