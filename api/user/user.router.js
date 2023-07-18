const router = require('express').Router()
const {viewItemController,claimByUserController,searchProductController,addReportController,viewProductByOrderDate,viewProductByName} = require('./user.controller')
router.get("/d",viewProductByOrderDate)
router.get("/n",viewProductByName)
router.get("/",viewItemController)
router.post('/',claimByUserController)
router.post("/search",searchProductController)
router.post("/report",addReportController)
module.exports = router