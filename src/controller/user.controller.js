import asynchandler from "../utils/asynchandler.js";

const RegisterUser = asynchandler(async (req,res)=>{
  res.status(200).json({
    message:'Hey welcome to server'
  })
})

export default RegisterUser