const User = require("../../models/User")

exports.leaveDetails=async(req,res)=>{
    try {
        console.log("hello 3")

        const {userId}=req.body
        console.log("hello 1",userId)

        const userDetails=await User.findById(userId).populate('takenLeave').exec()
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
        const Alldata=await User.find({}).populate('takenleave')
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
    const userDetails=await User.findById(userId)
    let leaveTotal=userDetails.creditleave+userDetails.Totalleave
    await User.findByIdAndUpdate({_id:userId},
    { $set: { totalLeave: leaveTotal } }
    );
    await User.findByIdAndUpdate({_id:userId},
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
        userData.creditleave=userData.creditleave+userData.awailbleLeave
        await userData.save()
    } catch (error) {
        console.log(error)
    }
}
exports.everyUser=async(req,res)=>{
    try {
        await User.updateMany({ $inc: { awailbleLeave: 1 } });
    } catch (error) {
        console.log(error)
    }
}

exports.everyUserReset=async(req,res)=>{
    try {
        await User.updateMany({ $set: { awailbleLeave: 0 } });
    } catch (error) {
        console.log(error)
    }
}