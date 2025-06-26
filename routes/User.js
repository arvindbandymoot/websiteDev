// Import the required modules
const express = require("express")
const router = express.Router()

// Import the required controllers and middleware functions
const {
  login,
  signup,
  sendotp,
} = require("../controller/Auth")

const { auth } = require("../midlewere/Auth")

// Routes for Login, Signup, and Authentication

// ********************************************************************************************************
//                                      Authentication routes
// ********************************************************************************************************

router.post("/login", login)
router.post("/signup", signup)
router.post("/sendotp", sendotp)

// Export the router for use in the main application
module.exports = router