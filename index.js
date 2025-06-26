const express=require('express')
const app=express()

const userRoutes=require('./routes/User')
const leaveRoutes=require('./routes/leave')
const DashboardRoutes=require('./routes/Dashboard')


const connectDB=require('./config/Database')
const cookieParser = require("cookie-parser");
const cors = require("cors");
require('dotenv').config()

connectDB();
app.use(express.json());
app.use(cookieParser());
app.use(
	cors({
		origin:"http://localhost:3000",
		credentials:true,
	})
)

// app.use(
// 	fileUpload({
// 		useTempFiles:true,
// 		tempFileDir:"/tmp",
// 	})
// )

//routes
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/leave", leaveRoutes);
app.use("/api/v1/Dashboard", DashboardRoutes);

app.listen(process.env.PORT,()=>{
    console.log(`server started.${process.env.PORT}`)
})