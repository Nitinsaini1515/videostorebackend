import 'dotenv/config'
import connection from "./src/db/index.js";
connection()
























// import mongoose from "mongoose";
// import{DB_NAME} from "./constant.js";
// import express from "express";
// import { configDotenv } from "dotenv";
// const app = express();
// ;( async ()=>{
//   try {
//     await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
// app.on("error",(err)=>{
//   console.log("Error in MongoDB connection:",err);
//   throw err;
// })
// app.listen(process.env.PORT,()=>{
//   console.log(`this server is sunning on th port of ${process.env.PORT}`)
// })
//   } catch (error) {
//     console.log("Error Connecting to MongoDB:", error);
//     process.exit(1)
//   }
// })()