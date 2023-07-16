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
  otp = otp * 1000000;
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
  <title>Lost and Found Application  - Team Elevate</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f5f5f5;
    }
    
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #ffffff;
      border-radius: 5px;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    }
    
    h1 {
      color: #333333;
      font-size: 24px;
      font-weight: bold;
      margin-top: 0;
    }
    
    p {
      color: #777777;
      font-size: 16px;
      margin-bottom: 20px;
    }
    
    .link {
      display: inline-block;
      margin-right: 10px;
      color: #3498db;
      text-decoration: none;
    }
    
    .link:hover {
      text-decoration: underline;
    }
    
    .social-icons {
      margin-top: 20px;
    }
    
    .social-icons a {
      display: inline-block;
      margin-right: 10px;
      width: 30px;
      height: 30px;
      line-height: 30px;
      text-align: center;
      border-radius: 50%;
      background-color: #3498db;
      color: #ffffff;
      text-decoration: none;
    }
  </style>
</head>
<body>
<div class="container">
  <h1>Lost and Found Application - Team Elevate</h1>
  <p>
    Dear User,<br>
    <br>
    Thank you for choosing our Lost and Found application developed by Team Elevate from Itahari International College. We are dedicated to helping you find your lost belongings and reconnect with your valuable items.<br>
    <br>
    Your One-Time Password (OTP) for registration is:<br>
    <br>
    <span class="otp">${otp}</span><br>
    <br>
    Our application provides a user-friendly interface for reporting lost items and searching for found items. We aim to provide a seamless experience to our users and ensure a high success rate in reuniting lost items with their rightful owners.<br>
    <br>
    Stay connected with us and get the latest updates by following our social media channels:<br>
    <br>
    <a class="link" href="https://www.facebook.com/team-elevate">Facebook</a>
    <a class="link" href="https://twitter.com/team-elevate">Twitter</a>
    <a class="link" href="https://www.instagram.com/team-elevate">Instagram</a>
  </p>
  <div class="social-icons">
    <a href="https://www.facebook.com/team-elevate">&#xf09a;</a>
    <a href="https://twitter.com/team-elevate">&#xf099;</a>
    <a href="https://www.instagram.com/team-elevate">&#xf16d;</a>
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
      console.log(result)
      if (err) {
  
        return res.json({
          success: 0,
          message: "Server Error"
        });
      }
 
      if (result.length > 0 && result[0].otp == otp) {
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

module.exports = router