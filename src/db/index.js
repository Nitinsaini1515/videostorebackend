
import mongoose from "mongoose";
import { DB_NAME } from "../../constants.js";

const connection = async ()=>{
  try {
  const connectionInstance =  await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
    console.log(`connection is successed and the host  is ${connectionInstance.connection.host}`)
  } catch (error) {
    console.log("Errr connection in mongo connection:",error)
    process.exit(1);
  }
}

export default connection