const express=require('express')
const router=express.Router()
const {leaveDetails,addyearLeave,creditleave,everyUser,everyUserReset}=require('../controller/Dashboard')

router.post('/leaveDetails',leaveDetails)
router.post('/addleaveInyear',addyearLeave)
router.post('/creditleaveInmonth',creditleave)
router.get('/addleaveInhalfmonth',everyUser)
router.get('/resetleaveInmonth',everyUserReset)
module.exports = router