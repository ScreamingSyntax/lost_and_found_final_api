const { viewItemsService,verifyOtpService, claimItemsService, searchItemSortByDateService,searchItemSortByNameService,claimItemService, searchProductService, verifyReportService, addReportService, viewProductByDate, viewProductByName,loginUserService,registerUserService, getUserByEmailService,viewReportService,lostItemFoundService,viewReportCategoriesService} = require('./user.service')
const { formattedDate } = require('../../tools/date.time')
const moment = require("moment-timezone");
const pool = require('../../config/database');
moment.tz.setDefault("Asia/Kathmandu");
const{ transporter} = require('../../otp/otp')
const {sign} = require('jsonwebtoken')
const cloudinary = require("../../config/cloudinary")
const { unlink } = require('node:fs');

const deleteImage = (filePath, imageName) => {
    unlink('upload/images/' + imageName, (err) => {
        if (err) throw err;
        console.log('successfully deleted /tmp/hello');
    });
}
module.exports ={
    registerUserController:(req,res)=>{
        const data = req.body;
        console.log(data)
        if(data.password != data.password2){
            return res.json({
                success:0,
                message:"The passwords donot match"
            })
        }
        getUserByEmailService(data.email,(err,results)=>{
            console.log(err)
            if(err){
                return res.json({
                    success:0,
                    message:"Server Error dd"
                })
            }

            if (results[0] === undefined){
                verifyOtpService(data,(err,results)=>{
                    if(err){
                        return res.json({
                            success:0,
                            message:"Server Error da"
                        })
                    }
                    console.log(results)
                    if (results[0] === undefined || results[0].otp != data.otp){
                        return res.json({
                            success:0,
                            message:"Wrong Otp"
                        })
                    }
                    registerUserService(data,(err,results)=>{
                        if(err){
                            return res.json({
                                success:0,
                                message:"Server Error db"
                            })
                        }
                        return res.json({
                            success:1,
                            message:"Successfully Registered :)"
                        })
                    })
                })  
            }
            else{
                return res.json({
                    success:0,
                    message:"The user already exists :)"
                })
            }
        })
       
    },
    tokenCheckerController:(req,res)=>{
        return res.json({
            success:1,
            message:"Token GUD"
        })
    },
    loginUserController:(req,res)=>{
        const data = req.body;
        console.log("Suyog Send")
        console.log(data);
        loginUserService(data,(err,results)=>{
            const jsontoken = sign({ result: results }, process.env.KEY, {
                expiresIn: "30d",
              });
            console.log("This is the results")
            console.log(results)
            if(err){
                return res.json({
                    success:0,
                    message:"Server Error"
                })
            }
            if(results[0] === undefined){
                return res.json({
                    success:0,
                    message:"The email doesn't exist"
                })
            }
            if(results[0].password === data.password){
                return res.json({
                    success:1,
                    message:"Successfully Logged In",
                    token:jsontoken
                })
            }
            if(results[0].password !== data.password){
                return res.json({
                    success:0,
                    message:"Invalid Credentials"
                })
            }
        })
    },
    viewItemController: (req, res) => {
        const data = req.body;
        console.log(data)
        viewItemsService(data, (err, results) => {
            if (err) {
                return res.json({
                    success: 0,
                    message: "Server Error"
                })
            }
            return res.json({
                success: 0,
                data: results
            })
        })
    },
    viewProductByOrderDate: (req, res) => {
        viewProductByDate((err, result) => {
            if (err) {
                return res.json({
                    success: 0,
                    message: "Server Error"
                })
            }
            return res.json({
                success: 1,
                data: result
            })
        })
    },
    viewProductByName: (req, res) => {
        viewProductByName((err, result) => {
            if (err) {
                return res.json({
                    success: 0,
                    message: "Server Error"
                })
            }
            return res.json({
                success: 1,
                data: result
            })
        })
    },
    claimByUserController: (req, res) => {
        const data = req.body;
        console.log(data);
            getUserByEmailService(data.claimed_by_email,(err,result)=>{
                if(err){
                    return res.json({
                        success:0,
                        message:"Server Issue"
                    })
                }
                if(result[0] === undefined){
                    return res.json({
                        success:0,
                        message:"Sorry that email doesn't exist"
                    })
                }
                claimItemService(data,  formattedDate, result[0].userName,(err, results) => {
                    if (err) {
                        return res.json({
                            success: 0,
                            message: "Server Issue"
                        });
                    }
                    return res.json({
                        success: 1,
                        message: "Your request is pending, Please visit SSD"
                    });
                })
            })
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
    searchedItemsSortByNameController:(req,res)=>{
        const data = req.body;
        console.log(data)
        searchItemSortByNameService(data,(err,results)=>{
            if(err){
                return res.json({
                    success:0,
                    message:"Server Issue"
                })
            }
            return res.json({
                success:1,
                data:results
            })
        })
        
    },
    searchedItemsSortByDateController:(req,res)=>{
        const data = req.body;
        console.log(data)
        searchItemSortByDateService(data,(err,results)=>{
            if(err){
                return res.json({
                    success:0,
                    message:"Server Issue"
                })
            }
            return res.json({
                success:1,
                data:results
            })
        })
        
    },
    viewReportController:(req,res) =>{
        data = req.body;
        console.log(data);
        viewReportService(data,(err,result)=>{
            if(err){
                return res.json({
                    success:0,
                    message:"Server Issue"
                })
            }
            return res.json({
                success:1,
                data:result
            })
        })
    },
    addReportController: async (req, res) => {
        let filePath;
        console.log(req.file)
        if(req.file){
            console.log("Image presents")
            const directoryPath = "upload/images"
            const imageName = req.file.filename;
            const imageUrl = req.file.path;
            await cloudinary.v2.uploader.upload(imageUrl,
                { public_id: `$this is ${imageName}` },
                function (error, result) {
                    console.log(result)
                    filePath = result.url;
                });
            deleteImage(directoryPath, imageName);
            
            console.log(filePath)
        }
        if(!req.file){
            console.log("Image not present")
        }
        data = req.body
        const date= formattedDate;
        getUserByEmailService(data.email,(err,result)=>{
            if(err){
                return res.json({
                    success:0,
                    message:"Server Issue"
                })
            }
            result = result[0]
            addReportService(result.userID,date,data,filePath,(err,result)=>{
                if(err){
                    return res.json({
                        success:0,
                        message:"Server Issue"
                    })
                }
                return res.json({
                    success:1,
                    message:"Report Added"
                })
            });
        })
    },
    lostItemFoundController:(req,res)=>{
        const data = req.body;
        console.log(data)
        lostItemFoundService(data,(err,results)=>{
            if(err){
                return res.json({
                    success:0,
                    message:"Server Issue"
                })
            }
            return res.json({
                success:1,
                message:"That's Good"
            })

        })
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
}