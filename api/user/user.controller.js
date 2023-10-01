const { viewItemsService,verifyOtpService, claimItemsService, searchItemSortByDateService,searchItemSortByNameService,claimItemService, searchProductService, verifyReportService, addReportService, viewProductByDate, viewProductByName,loginUserService,registerUserService, getUserByEmailService,viewReportService,lostItemFoundService,viewReportCategoriesService} = require('./user.service')
const { formattedDate } = require('../../tools/date.time')
const moment = require("moment-timezone");
const pool = require('../../config/database');
moment.tz.setDefault("Asia/Kathmandu");
const{ transporter} = require('../../otp/otp')
const {sign} = require('jsonwebtoken')

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
            if(err){
                return res.json({
                    success:0,
                    message:"Server Error"
                })
            }

            if (results[0] === undefined){
                verifyOtpService(data,(err,results)=>{
                    if(err){
                        return res.json({
                            success:0,
                            message:"Server Error"
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
                                message:"Server Error"
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
    addReportController: (req, res) => {
        console.log(req.body)
        data = req.body
        const date= formattedDate;
        getUserByEmailService(data.email,(err,result)=>{
            if(err){
                return res.json({
                    success:0,
                    message:"Server Issue"
                })
            }
            // console.log(result[]);
            result = result[0]
            addReportService(result.userID,date,data,(err,result)=>{
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