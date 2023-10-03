const { viewProduct: viewProductService, addItem: addItemService, removeItem: removeItemService, updateItemName: updateItemNameService, approveItemsService, sortByStatus, rejectItemsService, searchProductService, searchUnclaimedProductService, getAdminService, getParticularAdminDetails, showReportsService, detailedReportViewService, searchReportViewService, adminLoginService,viewReportCategoriesService,addCategoriesService,viewSpecificCategoriesService,sendMailToCategory } = require("./admin.service");
const { json } = require("body-parser");
const { sign } = require('jsonwebtoken')
const { fs } = require("node:fs");
const { unlink } = require('node:fs');
const cloudinary = require("../../config/cloudinary")
const { router, transporter } = require('../../otp/otp')

const deleteImage = (filePath, imageName) => {
    unlink('upload/images/' + imageName, (err) => {
        if (err) throw err;
        console.log('successfully deleted /tmp/hello');
    });
}

module.exports = {

    viewProduct: (req, res) => {

        viewProductService((err, results) => {
            if (err) {
                return res.json({
                    success: 0,
                    message: "Server Error v/p"
                });
            }
            return res.json({
                success: 1,
                data: results
            });
        });
    },
    searchProductController: (req, res) => {
        const data = req.body;
        searchProductService(data, (err, results) => {
            if (err) {
                return res.json({
                    success: 0,
                    message: "Server Issue"
                })
            }
            return res.json({
                success: 1,
                data: results
            })
        })
    },
    searchProductControllerUnclaimed: (req, res) => {
        const data = req.body;
        searchUnclaimedProductService(data, (err, results) => {
            if (err) {
                return res.json({
                    success: 0,
                    message: "Server Issue"
                })
            }
            return res.json({
                success: 1,
                data: results
            })
        })
    },
    sortProduct: (req, res) => {

        const data = req.body;
        sortByStatus(data, (err, results) => {

            if (err) {
                return res.json({
                    success: 0,
                    message: "Server Error"
                });
            }
            return res.json({
                success: 1,
                data: results
            });
        });
    },
    viewReportCategoriesController:(req,res)=>{
        console.log("ada")
        viewReportCategoriesService((err,results)=>{
            if(err){
                return res.json({
                    success:0,
                    message:"Server Error"
                })
            }
            return res.json({
                success:0,
                data:results
            })
        })
    },
    addItems: async (req, res) => {
        console.log(req.file)
        if (!req.file) {
            return res.json({
                success: 0,
                message: "No Image Provided"
            })
        }
        const directoryPath = "upload/images"
        const imageUrl = req.file.path;
        let filePath;
        const data = req.body;
        const imageName = req.file.filename;
        await cloudinary.v2.uploader.upload(imageUrl,
            { public_id: `$this is ${imageName}` },
            function (error, result) {
                console.log(result)
                filePath = result.url;
            });
        addItemService(data, filePath, (err, results) => {
            if (err) {
                return res.json({
                    success: 0,
                    message: "Error Adding Items"
                });
            }
            deleteImage(directoryPath, imageName);
            return res.json({
                success: 1,
                data: results
            });
        });
    },
    removeItem: (req, res) => {
        const directoryPath = "upload/images"
        const data = req.body;


        removeItemService(data, (err, results) => {
            if (err) {
                return res.json({
                    success: 0,
                    message: "Error Deleting Items"
                })
            }
            return res.json({
                success: 1,
                data: results
            })
        })
    },
    updateItemName: (req, res) => {
        const filePath = req.file.filename;

        const data = req.body;

        updateItemNameService(data, filePath, (err, results) => {
            if (err) {
                return res.json({
                    success: 0,
                    message: "Error Updating Values"
                })
            }
            return res.json({
                success: 1,
                data: results
            })
        })
    },
    approveItemController: (req, res) => {
        const data = req.body;
        approveItemsService(data, (err, results) => {
            if (err) {
                return res.json({
                    success: 0,
                    message: "Error Claiming Item"
                })
            }
            return res.json({
                success: 1,
                message: "Successfully Approved"
            })
        })
    },
    rejectItemController: (req, res) => {
        const data = req.body;
        rejectItemsService(data, (err, results) => {
            if (err) {
                return res.json({
                    success: 0,
                    message: "Error Claiming Item"
                })
            }
            return res.json({
                success: 1,
                message: "Successfully Approved"
            })
        })
    },
    adminLoginController: (req, res) => {
        const data = req.body;
        adminLoginService(data, (err, results) => {
            console.log(results)
            if (err) {
                return res.json({
                    success: 0,
                    message: "Server Error"
                })
            }
            if (results.length == 0) {
                return res.json({
                    success: 0,
                    message: "Invalid Credentials"
                })
            }
            const jsontoken = sign({ result: results }, process.env.KEY, {
                expiresIn: "365d",
            });
            if (results[0].username == data.username && results[0].password == data.password) {
                return res.json({
                    success: 1,
                    message: "Successfully Logged :)",
                    token: jsontoken
                })
            }
            else {
                return res.json({
                    success: 0,
                    message: "Invalid Credentials"
                })
            }
        })
    },
    showReportController: (req, res) => {
        showReportsService((err, results) => {
            if (err) {
                return res.json({
                    success: 0,
                    message: "Server Error"
                })
            }
            return res.json({
                success: 1,
                data: results
            })
        })
    },
    detailedReportController: (req, res) => {
        const data = req.body;
        detailedReportViewService(data, (err, results) => {
            if (err) {
                return res.json({
                    success: 0,
                    message: "Server Error"
                })
            }
            return res.json({
                success: 1,
                data: results
            })
        })
    },
    searchReportViewController: (req, res) => {
        const data = req.body;
        console.log(data)
        searchReportViewService(data, (err, results) => {
            if (err) {
                return res.json({
                    success: 0,
                    message: "Server Error"
                })
            }
            return res.json({
                success: 1,
                data: results
            })
        })
    },
    sendFoundNotification: (req, res) => {
        email = req.body.email;
        // console.log(email)
        report_title = req.body. report_title; 
        date = req.body.date_reported;
        userName = req.body.userName;
        console.log(req.body)
        var mailOptions = {
            to: email,
            subject: "Your item might have been found ",
            html: `
            <!DOCTYPE html>
            <html>
            <head>
               <title>Lost and Found Application - Team Elevate</title>
               <style>
                  body {
                     font-family: 'Poppins', sans-serif;
                     background-color: #f5f5f5;
                     margin: 0;
                     padding: 0;
                  }
            
                  .container {
                     max-width: 600px;
                     margin: 0 auto;
                     background-color: #ffffff;
                     border-radius: 10px;
                     box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                     padding: 20px;
                  }
            
                  h1 {
                     color: #3498db;
                     font-size: 36px;
                     margin: 0;
                  }
            
                  h3 {
                     color: #3498db;
                     font-size: 18px;
                     margin: 20px 0;
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
                     text-align: center;
                  }
            
                  .social-icons a {
                     display: inline-block;
                     margin: 0 10px;
                     width: 40px;
                     height: 40px;
                     line-height: 40px;
                     text-align: center;
                     border-radius: 50%;
                     background-color: #3498db;
                     color: #ffffff;
                     text-decoration: none;
                     font-size: 18px;
                  }
            
                  .footer {
                     margin-top: 30px;
                     text-align: center;
                  }
            
                  .footer p {
                     color: #777777;
                     font-size: 14px;
                  }
               </style>
            </head>
            <body>
               <div class="container fade-in scale-in">
                  <h1>Lost and Found</h1>
                  <p>
                     Hi ${userName}, the item you've reported might have been found. Please check the details below.
                  </p>
                  <div class="otp-container">
                     <p class="otp">Item Details</p>
                     <p><strong>Item Name:</strong> ${report_title}</p>
                     <p><strong>Date Reported:</strong> ${date} </p>
                  </div>
               </div>
               <div class="footer">
                  <p>© 2023 Lost and Found Application - Team Elevate</p>
               </div>
            </body>
            </html>            
            `
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return res.json({
                    success: 0,
                    message: "Error Sending Mail"
                })
            }
            console.log(info)
            return res.json({
                success: 1,
                message: "Sent Mail"
            })
        });
    },
    addCategoryController: (req,res)=>{
        const data = req.body;
        console.log(data)
        console.log("Pathayo")
        viewSpecificCategoriesService(data.type,(err,result)=>{
            if(err){
                return res.json({
                    success:0,
                    message:"Server Error"
                })
            }
            if(result[0] === undefined){
                addCategoriesService(data,(err,result)=>{
                    if(err){
                        return res.json({
                            success:0,
                            message:"Server Error"
                        })
                    }
                    return res.json({
                        success:1,
                        message:"Successfully Added"
                    })
                })
            }
            else{
                return res.json({
                    success:0,
                    message:"The Category already exists"
                })
            }
        })
    },
    categoryEmailController:(req,res)=>{
        data = req.body;
        type = data.type
        sendMailToCategory(data,(err,result)=>{
            if(err){
                return res.json({
                    success:0,
                    message:"Server Error"
                })
            }
            if(result[0] === undefined){
                console.log("Meo")
                return res.json({
                    success:0,
                    message:"No Reports Found of that Category"
                })
            }
            email_list = []
            result.forEach(element=> email_list.push(element.email))
            if(result[0] !== undefined){
                    email = data.email
                        var mailOptions = {
                            to: email_list,
                            subject: "Your item might have been found ",
                            html: `
                            <!DOCTYPE html>
                            <html>
                            <head>
                               <title>Lost and Found Application - Team Elevate</title>
                               <style>
                                  body {
                                     font-family: 'Poppins', sans-serif;
                                     background-color: #f5f5f5;
                                     margin: 0;
                                     padding: 0;
                                  }
                            
                                  .container {
                                     max-width: 600px;
                                     margin: 0 auto;
                                     background-color: #ffffff;
                                     border-radius: 10px;
                                     box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                                     padding: 20px;
                                  }
                            
                                  h1 {
                                     color: #3498db;
                                     font-size: 36px;
                                     margin: 0;
                                  }
                            
                                  h3 {
                                     color: #3498db;
                                     font-size: 18px;
                                     margin: 20px 0;
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
                                     text-align: center;
                                  }
                                  .social-icons a {
                                     display: inline-block;
                                     margin: 0 10px;
                                     width: 40px;
                                     height: 40px;
                                     line-height: 40px;
                                     text-align: center;
                                     border-radius: 50%;
                                     background-color: #3498db;
                                     color: #ffffff;
                                     text-decoration: none;
                                     font-size: 18px;
                                  }
                                  .footer {
                                     margin-top: 30px;
                                     text-align: center;
                                  }
                                  .footer p {
                                     color: #777777;
                                     font-size: 14px;
                                  }
                               </style>
                            </head>
                            <body>
                               <div class="container fade-in scale-in">
                                  <h1>Lost and Found</h1>
                                  <p>
                                    We've just updated our website, and it seems like we've come across an item that could potentially be a match for the one you've lost. We're excited to share that we've found a ${type} that might be yours! 
                                  </p>

                               </div>
                               <div class="footer">
                                  <p>© 2023 Lost and Found Application - Team Elevate</p>
                               </div>
                            </body>
                            </html>            
                            `
                        };
                        transporter.sendMail(mailOptions, (error, info) => {
                            if (error) {
                                return res.json({
                                    success: 0,
                                    message: "Error Sending Mail"
                                })
                            }
                            console.log(info)
                            return res.json({
                                success: 1,
                                message: "Sent Mail"
                            })
                        });
    
            }

        })
        // email = ["whcloud91@gmail.com","np05cp4s220001@iic.edu.np"]
    }
};
