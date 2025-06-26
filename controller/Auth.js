const User=require('../models/User')
const bcrypt = require("bcrypt")
const jwt=require("jsonwebtoken")
const otpGenerator=require('otp-generator')
const OTP=require('../models/OTP')
require('dotenv').config()




exports.signup=async(req,res)=>{
    try {
    const {firstName,
        lastName,
      email,
      password,
      confirmPassword,
      accountType,
      otp}=req.body
    if(!firstName ||!lastName||!email||!password||!confirmPassword||
        !accountType||!otp
    ) {
        return res.status(403).send({
            success:false,
            message:"All Field are required"
        })
    } 
    console.log("hellow")
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message:
          "Password and Confirm Password do not match. Please try again.",
      })
    }
    // Check if user already exists
    const existUser=await User.findOne({email})
    if(existUser){
        return res.status(403).send({
            success:false,
            message:"Allready User exist"
        })
    }

    const otpresponse=await OTP.find({email}).sort({ createdAt: -1 }).limit(1)
    console.log(otpresponse)
    console.log("hellow")
    if (otpresponse.length === 0) {
      // OTP not found for the email
      return res.status(400).json({
        success: false,
        message: "The OTP is not valid",
      })
    } else if (otp !== otpresponse[0].otp) {
      // Invalid OTP
      return res.status(400).json({
        success: false,
        message: "The OTP is not valid",
      })
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      accountType: accountType,
    //   approved: approved,
     // additionalDetails: profileDetails._id,
      image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName}${lastName}`,
    })
    return res.status(200).json({
      success: true,
      user,
      message: "User registered successfully",
    })

    } catch (error) {
        console.error(error)
    return res.status(500).json({
      success: false,
      message: "User cannot be registered. Please try again.",
    })
    }
}








exports.login=async(req,res)=>{
    try {
        const {email,password}=req.body
        if (!email || !password) {
        return res.status(400).json({
        success: false,
        message: `Please Fill up All the Required Fields`,
      })
    }
    const user = await User.findOne({ email }).populate("takenLeave")

    // If user not found with provided email
    if (!user) {
      // Return 401 Unauthorized status code with error message
      return res.status(401).json({
        success: false,
        message: `User is not Registered with Us Please SignUp to Continue`,
      })
    }
    //genrate JWT token and compare password
    if(await bcrypt.compare(password,user.password)){
        const token=jwt.sign(
            { email: user.email, id: user._id, accountType: user.accountType },
        process.env.JWT_SECRET,
        {
          expiresIn: "24h",
        }
        )
        user.token = token
        user.password = undefined
        // Set cookie for token and return success response
      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      }
      res.cookie("token", token, options).status(200).json({
        success: true,
        token,
        user,
        message: `User Login Success`,
      })  
    }
    else{
        return res.status(401).json({
        success: false,
        message: `Password is incorrect`,
      })
    }

    } catch (error) {
        console.error(error)
    // Return 500 Internal Server Error status code with error message
    return res.status(500).json({
      success: false,
      message: `Login Failure Please Try Again`,
    })
    }
}


exports.sendotp=async(req,res)=>{
    try {
    const { email } = req.body
    const checkUserPresent = await User.findOne({ email })
    if (checkUserPresent) {
      return res.status(401).json({
        success: false,
        message: `User is Already Registered`,
      })
    }
     var otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    })
    const result = await OTP.findOne({ otp: otp })
    console.log("Result is Generate OTP Func")
    console.log("OTP", otp)
    console.log("Result", result)
    while (result) {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      })
      result = await OTP.findOne({ otp: otp })
    }
    const otpPayload = { email, otp }
    const otpBody = await OTP.create(otpPayload)
    console.log("OTP Body", otpBody)
    res.status(200).json({
      success: true,
      message: `OTP Sent Successfully`,
      otp,
    })
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ success: false, error: error.message })
    }
}
