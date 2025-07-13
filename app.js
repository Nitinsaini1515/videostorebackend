import express from "express";
const app = express()
import cookieParser from "cookie-parser";
import cors from 'cors'
import router from "./src/routes/user.route.js";
app.use(cors({
origin :process.env.CORS_ORIGIN,
credentials:true

}))

app.use(express.json({limit:"20kb"}))
app.use(express.urlencoded({extended:true,limit:"20kb"}))
app.use(express.static("public"))


app.use("/api/v1/users",router)

export default app

