const {viewProduct,addItems,removeItem,updateItemName,approveItemController,sortProduct,rejectItemController,searchProductController,searchProductControllerUnclaimed} = require("./admin.controller");
const router = require('express').Router();
const multer = require("multer");
const path = require("path");
const express = require("express");
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

router.post("/sort",sortProduct)
router.get("/",viewProduct);
router.post("/",upload.single('item_image'), addItems);
router.delete("/",removeItem);
router.patch("/",upload.single('item_image'),updateItemName);
router.post("/approve",approveItemController)
router.post("/reject",rejectItemController)
router.post("/search",searchProductController)
router.post("/searchU",searchProductControllerUnclaimed)


module.exports = router;