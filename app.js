const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./config/database")
const fs = require('fs')
const dotenv = require('dotenv')
dotenv.config();
app.use(cors({
    origin:'*'
}))
const userRouter = require('./api/user/user.router');
const adminRouter = require('./api/admin/admin.router');
const mailRouter = require('./otp/otp');
const { resolve } = require("path");
const { rejects } = require("assert");
app.use(express.json());
app.use("/api/admin/",adminRouter);
app.use("/item_image", express.static('upload/images'))
app.use("/api/user/",userRouter)
app.use('/otp/',mailRouter)
const port = process.env.PORT || 8000;


app.listen(port,()=>{
    console.log("Server running on port ",port);
});
