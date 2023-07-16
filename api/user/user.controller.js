const {viewItemsService,claimItemsService,claimItemService,searchProductService} = require('./user.service')
const {fetchDateTime} = require('../../tools/date.time')
const moment = require("moment-timezone");
moment.tz.setDefault("Asia/Kathmandu");

module.exports = {
    viewItemController:(req,res)=>{
        const data = req.body;
        viewItemsService(data,(err,results)=>{
            if(err){
                return res.json({
                    success:0,
                    message:"Error Fetching Items"
                })
            }
            return res.json({
                success:0,
                data:results
            })
        })
    },
    claimByUserController:(req,res)=>{
        const data = req.body;
        fetchDateTime().then((value)=>
        {

        if (value == false){
            return res.json({
                success:0,
                message:"Error fetching date and time"
            })
        }
        // date = 
        current_date = moment(value).format("YYYY-MM-DD");
        claimItemService(data,current_date,(err,results)=>{
            if (err){
                return res.json({
                    success:0,
                    message:"Server Issue"
                })
            }
            return res.json({
                success:1,
                message:"Your request is pending, Please visit SSD"
            })
        })
    })
    },
    searchProductController:(req,res)=>{
        const data = req.body;
     
        searchProductService(data,(err,results)=>{
            if (err){
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
}