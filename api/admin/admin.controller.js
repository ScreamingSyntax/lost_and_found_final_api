const { viewProduct: viewProductService, addItem: addItemService,removeItem: removeItemService,updateItemName: updateItemNameService,approveItemsService,sortByStatus,rejectItemsService,searchProductService,searchUnclaimedProductService } = require("./admin.service");
const { json } = require("body-parser");
const{ fs } = require("node:fs");
const { unlink } = require('node:fs');

const deleteImage = (filePath,imageName) => {
    unlink('upload/images/'+imageName, (err) => {
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
                    message: "Error Fetching Data"
                });
            }
            return res.json({
                success: 1,
                data: results
            });
        });
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
    searchProductControllerUnclaimed:(req,res)=>{
        const data = req.body;
        searchUnclaimedProductService(data,(err,results)=>{
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
    sortProduct: (req, res) => {

        const data = req.body;
        sortByStatus(data,(err, results) => {

            if (err) {
                return res.json({
                    success: 0,
                    message: "Error Fetching Data"
                });
            }
            return res.json({
                success: 1,
                data: results
            });
        });
    },
    addItems: (req, res) => {
        if(!req.file){
            return res.json({
                success: 0,
                message:"No Image Provided"
            })
        }
        const filePath =req.file.filename;

        const data = req.body;
      
        addItemService(data,filePath, (err, results) => {
            
            if (err) {
                return res.json({
                    success: 0,
                    message: "Error Adding Items"
                });
            }
            return res.json({
                success: 1,
                data: results
            });
        });
    },
    removeItem:(req,res)=>{
        const directoryPath = "upload/images"
        const data = req.body;

  
        removeItemService(data,(err,results)=>{
            if(err){
                return res.json({
                    success:0,
                    message:"Error Deleting Items"
                })
            }
            deleteImage(directoryPath,data.item_image);
            return res.json({
                success:1,
                data: results
            })
        })
    },
    updateItemName:(req,res)=>{
        const filePath =req.file.filename;
        const data = req.body;

        updateItemNameService(data,filePath,(err,results)=>{
            if(err){
                return res.json({
                    success:0,
                    message:"Error Updating Values"
                })
            }
            return res.json({
                success:1,
                data:results
            })
        })
    },
    approveItemController:(req,res)=>{
        const data = req.body;

        approveItemsService(data,(err,results)=>{
          
            if (err){
                return res.json({
                    success:0,
                    message:"Error Claiming Item"
                })
            }
            return res.json({
                success:1,
                message:"Successfully Approved"
            })
        })
    },
    rejectItemController:(req,res)=>{
        const data = req.body;
     
        rejectItemsService(data,(err,results)=>{
            if (err){
                return res.json({
                    success:0,
                    message:"Error Claiming Item"
                })
            }
            return res.json({
                success:1,
                message:"Successfully Approved"
            })
        })
    },
};
