import ApiErrors from "../utils/apierror.js";
import asynchandler from "../utils/asynchandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.models.js";

//  const verifyJwt = asynchandler(async (req,res,next)=>{
//   try {
//     // const token  = req.cookies?.accesstoken ||req.header("Authorization")?.replace("Bearer ","")
//     console.log("COOKIE TOKEN:", req.cookies?.accesstoken); // should be a string
// console.log("AUTH HEADER:", req.header("Authorization")?.replace("Bearer ","")); // should be "Bearer <token>"

//     // console.log("token",token)
//     if(!token){
//       throw new ApiErrors(401,"Unauthorized request")
  
//     }
//    const decodedtoken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
//   console.log(decodedtoken)
//   const user =  await User.findById(decodedtoken?._id).select("-password -refershtoken")
//   if(!user){
//     throw new ApiErrors(401,"Invalid access token")
//   }
//   req.user = user;
//   next()
//   } catch (error) {
// throw new ApiErrors(401,error?.message||"Invalid access token")
//   }
// })

// export default verifyJwt
 const verifyJWT = asynchandler(async(req, _, next) => {
    try {
        const token = req.cookies?.accesstoken || req.header("Authorization")?.replace("Bearer ", "")
        
        // console.log(token);
        if (!token) {
            throw new ApiErrors(401, "Unauthorized request")
        }
    
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
    
        if (!user) {
            
            throw new ApiErrors(401, "Invalid Access Token")
        }
    
        req.user = user;
        next()
    } catch (error) {
        throw new ApiErrors(401, error?.message || "Invalid access token")
    }
    
})
export default verifyJWT