const {viewProduct,addItems,removeItem,updateItemName,searchReportViewController,approveItemController,sortProduct,rejectItemController,searchProductController,searchProductControllerUnclaimed,showReportController,detailedReportController,adminLoginController, viewProductByOrderDate,sendFoundNotification,viewReportCategoriesController,addCategoryController} = require("./admin.controller");
const router = require('express').Router();
const multer = require("multer");
const path = require("path");
const express = require("express");
const {checkToken} = require('../../token/token.validation')
const { searchUnclaimedProductService } = require("./admin.service");


const storage = multer.diskStorage({
    destination:'./upload/images',
    filename:(req,file,callBack)=>{
        return callBack(null,`${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
});
const upload = multer({storage:storage,
    limits:{fileSize:null}
})

router.get("/lost_categories",viewReportCategoriesController)
router.post("/lost_categories",addCategoryController)
router.post("/sort",checkToken,sortProduct);
router.get("/",checkToken,viewProduct);
router.post("/",checkToken,upload.single('item_image'), addItems);
router.delete("/",checkToken,removeItem);
router.patch("/",checkToken,upload.single('item_image'),updateItemName);
router.post("/approve",checkToken,approveItemController);
router.post("/reject",checkToken,rejectItemController);
router.post("/search",checkToken,searchProductController);
router.post("/searchU",checkToken,searchProductControllerUnclaimed);
router.get("/report",showReportController);
router.post("/report",checkToken,detailedReportController);
router.post("/searchR",checkToken,searchReportViewController)
router.post("/login",adminLoginController);
router.post("/mail",sendFoundNotification);
module.exports = router;