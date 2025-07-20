import asynchandler from "../utils/asynchandler.js";
import ApiErrors from "../utils/apierror.js";
import ApiRsponse from "../utils/apiresponse.js";
import { User } from "../models/user.models.js";
import uploadOnCloudinary from "../utils/coudinary.js";


const generateAccessaAndRefreshToken = async(userId)=>{
  try {
    const user = await User.findById(userId)
    const accesstoken = user.generateAccessToken()
    const refreshtoken = user.generateRefreshToken()
    user.refreshtoken = refreshtoken
    await user.save({validateBeforeSave:false})
    return {accesstoken,refreshtoken}
  } catch (error) {

    throw new ApiErrors(500,"Something went wrong while generating the access and refresh token")
  }
}
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
  const { email, password, username } = req.body;

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

  const {accesstoken,refreshtoken} = await generateAccessaAndRefreshToken(user._id)

});
