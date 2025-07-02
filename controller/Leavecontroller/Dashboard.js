const User = require("../../models/User")
const LeaveInfo = require("../../models/LeaveInfo")

exports.leaveDetails=async(req,res)=>{
    try {
        console.log("hello 3")

        const {userId}=req.body
        console.log("hello 1",userId)

        const userDetails=await User.findById(userId).populate('leaveDetails').exec()
        //const userDetails=await User.find({})
        console.log("hello 1")
        res.status(200).json({
            success:true,
            message:"get successfully",
            data:userDetails
        })
    
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success:false,
            message:"problem to get"

        })
    }
}





exports.getAllleave=async(req,res)=>{
    try {
        const Alldata=await User.find({}).populate('leaveDetails').exec()
        if(!Alldata){
            return res.status(200).json({
                success:false,
                meassage:"No data exist..."
            })
        }
        res.status(200).json({
            success:true,
            message:"Data fetch successfully ...",
            data:Alldata
        })
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            success:false,
            message:"Error during fetch.."
        })
    }
}

exports.addyearLeave=async(req,res)=>{
  try {
    const userId=req.user.id
    /* this code change the data value after one year*/
    const userdata=await User.findById(userId)
    if(!userdata){
        return res.status(404).json({
            success:false,
            message:"User not found"
        })
    }
    const userDetails=await LeaveInfo.findById({_id:userdata.leaveDetails})
    let leaveTotal=userDetails.creditleave+userDetails.Totalleave
    await LeaveInfo.findByIdAndUpdate({_id:userdata.leaveDetails},
    { $set: { totalLeave: leaveTotal } }
    );
    await LeaveInfo.findByIdAndUpdate({_id:userdata.leaveDetails},
        {$set:{creditleave:0}},
        {new:true}
    )

  } catch (error) {
    console.error('Error adding leave:', err);
  }
}
exports.creditleave=async(req,res)=>{
    try {
        const {userId}=req.body
        const userData=await User.findById(userId)
        if(!userData){
            return res.status(404).json({
                success:false,
                message:"User not found"
            })
        }
        const userLeaveInfo=await LeaveInfo.findById({_id:userData.leaveDetails})
        userLeaveInfo.creditleave=userLeaveInfo.creditleave+userLeaveInfo.awailbleLeave
        await userLeaveInfo.save()
    } catch (error) {
        console.log(error)
    }
}
exports.everyUser=async(req,res)=>{
    try {
        await LeaveInfo.updateMany({ $inc: { awailbleLeave: 1 } });
    } catch (error) {
        console.log(error)
    }
}

exports.everyUserReset=async(req,res)=>{
    try {
        await LeaveInfo.updateMany({ $set: { awailbleLeave: 0 } });
    } catch (error) {
        console.log(error)
    }
}