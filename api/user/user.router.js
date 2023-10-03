const {checkToken} = require('../../token/token.validation')
const multer = require("multer");
const path = require("path");


const storage = multer.diskStorage({
    destination:'./upload/images',
    filename:(req,file,callBack)=>{
        return callBack(null,`${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
});
const upload = multer({storage:storage,
    limits:{fileSize:null}
})

const router = require('express').Router()
const {registerUserController, loginUserController,searchedItemsSortByDateController,searchedItemsSortByNameController, viewItemController,claimByUserController,searchProductController,addReportController,viewProductByOrderDate,viewProductByName,tokenCheckerController,viewReportController,lostItemFoundController,viewReportCategoriesController} = require('./user.controller')
router.post("/login",loginUserController)
router.get("/d",checkToken,viewProductByOrderDate)
router.get("/n",checkToken,viewProductByName)
router.get("/",viewItemController)
router.post("/tokenCheck",checkToken,tokenCheckerController)
router.post('/',checkToken,claimByUserController)
router.post("/register",registerUserController)
router.post("/search",checkToken,searchProductController)
router.post("/report",checkToken,upload.single('report_image'),addReportController)
router.post("/reportG",checkToken,viewReportController)
router.post("/searchD",checkToken,searchedItemsSortByDateController)
router.post("/searchN",checkToken,searchedItemsSortByNameController)
router.post("/reportFound",checkToken,lostItemFoundController)
router.get("/reportCategories",viewReportCategoriesController)
module.exports = router