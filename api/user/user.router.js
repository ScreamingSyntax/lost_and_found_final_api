const router = require('express').Router()
const {viewItemController,claimByUserController,searchProductController} = require('./user.controller')

router.get("/",viewItemController)
router.post('/',claimByUserController)
router.post("/search",searchProductController)
module.exports = router