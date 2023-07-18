const router=require('express').Router();
const nodemailer=require('nodemailer');
const { route } = require('../api/user/user.router');
const pool = require('../config/database');
const { response } = require('express');
const moment = require("moment-timezone");
const { fetchDateTime } = require('../tools/date.time');
moment.tz.setDefault("Asia/Kathmandu");
require('dotenv').config()

// let checkOtp;

otpFun = () => {
  var email;
  var otp = Math.random();
  otp = otp * 1000000 + 1;
  // console.log()
  otp = parseInt(otp);
  return otp;
} 

let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    service : 'Gmail',
    auth: {
      user: process.env.MAILER_EMAIL,
      pass: process.env.MAILER_PASSWORD,
    }
    
});

router.post('/send',function(req,res){
    email=req.body.email;
    userName=req.body.name;
    var otp = otpFun();
    const pattern = /^[a-zA-Z0-9-]+\@iic\.edu\.np$/;
    if (!pattern.test(email)) {
      return res.json({
        success:0,
        message:"Use your college email(@iic.edu.np)"
      })
    }
    pool.query(
        "SELECT * FROM otp_data where email=? and name=?",
        [email,userName],
        (err,result,field)=>{
            if(result.length==0){
                pool.query("INSERT into otp_data(email,otp,name) values (?,?,?)",
                [email,otp,userName])
            }
            
            if(result.length!=0){
                pool.query("UPDATE otp_data set otp=? where email=? and name=?",
                [otp,email,userName]
                )
            }
        }
    )
    var mailOptions={
       to: req.body.email,
       subject: "Otp for registration is: ",
       html: `
       <!DOCTYPE html>
<html>
<head>
  <title>Lost and Found Application - Team Elevate</title>
  <style>
    body {
      font-family: 'Poppins', sans-serif;
      background-color: #f5f5f5;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
    }

    .container {
      max-width: 500px;
      padding: 40px;
      background-color: #ffffff;
      border-radius: 5px;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
      text-align: center;
    }

    h1 {
      color: #3498db;
      font-size: 30px;
      margin-top: 0;
    }
    h3{
      color: #3498db;
      font-size: 15px;
      margin: 20 0;
    }
    p {
      color: #777777;
      font-size: 16px;
      line-height: 1.5;
      margin-bottom: 20px;
    }

    .otp-container {
      background-color: #f5f5f5;
      border: 2px solid #3498db;
      border-radius: 5px;
      padding: 10px;
      display: inline-block;
    }

    .otp {
      font-weight: bold;
      color: #3498db;
      font-size: 24px;
    }

    .link {
      color: #3498db;
      text-decoration: none;
      transition: color 0.3s ease;
    }

    .link:hover {
      color: #ff7f50;
    }

    .social-icons {
      margin-top: 20px;
      display: flex;
      justify-content: center;
    }

    .social-icons a {
      display: inline-block;
      margin-right: 10px;
      width: 40px;
      height: 40px;
      line-height: 40px;
      text-align: center;
      border-radius: 50%;
      background-color: #3498db;
      color: #ffffff;
      text-decoration: none;
    }

  </style>

</head>
<body>
<div class="container fade-in scale-in">
  <h1>Lost and Found</h1>
  <p>
    Thank you for choosing our Lost and Found application developed by Team Elevate from Itahari International College. We are dedicated to helping you find your lost belongings and reconnect with your valuable items.
  </p>
  <h3>YOUR OTP :</h3>
  <div class="otp-container">
    <span class="otp">${otp}</span>
    <a href="tel:${otp}">Copy this number</a>
  </div>
</div>
</body>
</html>
       `
     };
     transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.json({
                success:0,
                message:"Error Sending Opt"
            })
        }
        return res.json({
            success:1,
            message:"Send Opt Successfully"
        })
    });
});

router.post('/verify', function (req, res) {
  
  console.log(req.body)
  const email = req.body.email;
  const otp = req.body.otp;
  const item_id = req.body.item_id;
  const userName = req.body.userName;

  fetchDateTime().then((value)=>{
 
  if (value == false){
      return res.json({
          success:0,
          message:"Error fetching date and time"
      })
  }
  // date = 
  current_date = moment(value).format("YYYY-MM-DD");
  pool.query(
    "SELECT otp FROM otp_data WHERE email=? AND name=?",
    [email, userName],
    (err, result, field) => {
      if (err) {
        return res.json({
          success: 0,
          message: "Server Error"
        });
      }
      if (result.length > 0 && result[0].otp == otp) {
        pool.query(
          "SELECT * FROM claim where claimed_by_email=? and claimed_by=? and item_id=?",
          [email,userName,item_id],
          (err,result,field)=>{  
            console.log(`Claimed Bro`,result)
              if(!result[0]){
                pool.query(
                  "INSERT INTO claim (item_id, claimed_by, claimed_by_email, claim_status,claimed_date) VALUES (?, ?, ?, ?,?)",
                  [item_id, userName, email, "Pending",current_date],
                  (err, result, fields) => {
                    if (err) {
                      return res.json({
                        success: 0,
                        message: "Error claiming particular item"
                      });
                    }
                    return res.json({
                      success: 1,
                      message: "Your request is pending, please visit SSD"
                    });
                  }
                );
              }
              else{
                return res.json({
                  success:0,
                  message:"You have already claimed the item"
                })
              }              
              // if(result.length!=0){
              //     pool.query("UPDATE otp_data set otp=? where email=? and name=?",
              //     [otp,email,userName]
              //     )
              // }
          }
      )

        
      } else {
        return res.json({
          success: 0,
          message: "Wrong OTP"
        });
      }
    }
  );
      
})
});

module.exports = {router,transporter}