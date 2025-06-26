const User=require('../models/User')
const Leave=require('../models/Leave')
const cron = require('node-cron');
exports.leave=async(req,res)=>{
    try {
        const {name,email,startdate,enddate,description}=req.body
        const Userid=req.user.id
        //console.log("hellow",name,Userid)
        if(!name||!email||!startdate||!description){
            return res.status(403).send({
            success:false,
            message:"All Field are required"
        })
        }
        console.log("starte",startdate)
        const startdate1 = new Date(startdate)
        const enddate1 = new Date(enddate)
        console.log("Newdate",startdate1)
    const newleave=await Leave.create({name,email,startdate:startdate1,enddate:enddate1,user:Userid,description})
        res.status(200).json({
        success: true,
        data: newleave,
        message: "Leave approval request Created Successfully",
    })

    } catch (error) {
      console.error(error)
      res.status(500).json({
      success: false,
      message: "Failed to create Leave approval",
      error: error.message,
    })
    }
}
exports.approval=async(req,res)=>{
    try {
        const {status,leaveId,userId}=req.body
        if(req.user.accountType=="Employees"){
            return res.status(500).json({
                success:false,
                message:"Only admin approve the lleave"
            })
        }
        if(!status){
            return res.status(500).json({
                success:false,
                message:"Leave Request Not approve."
            })
        }
        let leaveData=await Leave.findById(leaveId)
        const userData=await User.findById(userId)
        leaveData.status=status
        //await leaveData.save()
        if(leaveData.enddate.getTime() == leaveData.startdate.getTime()){
            const date = leaveData.startdate; // Example date
            const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            const dayOfWeek = days[date.getDay()];
            console.log("day",dayOfWeek)
            if(dayOfWeek == 'Sunday'){
                console.log("hello123")
                if(userData.awailbleLeave>0){
                    var leaveNumber=userData.awailbleLeave-1
                    userData.awailbleLeave=leaveNumber
                    userData.extraleave=userData.extraleave+2
                    leaveData.isawailbleleave=1
                    leaveData.isextraleave=2
                }
                else{
                    userData.extraleave=userData.extraleave+3
                    leaveData.isextraleave=3
                }
            }
            else{
                if(userData.awailbleLeave>0){
                    var leaveNumber=userData.awailbleLeave-1
                    userData.awailbleLeave=leaveNumber
                    leaveData.isawailbleleave=1
                }
                else{
                userData.extraleave=userData.extraleave+1
                leaveData.isextraleave=1
                }
            }
            await userData.save()
            await leaveData.save()
        }
        else{
            const date1 = leaveData.startdate;
            const date2 = leaveData.enddate;

            // Difference in milliseconds
            const diffInMs = date2 - date1;

            // Convert to days
            const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
            console.log("defferent days",diffInDays)
            const userData=await User.findById(userId)
            console.log("defferent days12")

            if(userData.awailbleLeave>0){
                let a=diffInDays-userData.awailbleLeave
                userData.extraleave=a
                leaveData.isawailbleleave=userData.awailbleLeave
                leaveData.isextraleave=a
                userData.awailbleLeave=0
            }
            else{
                //const userData1=await User.findById(userId)
                console.log("hello word...")
                let b=userData.extraleave+diffInDays
                //console.log(b)
                 //console.log("hello word...1")
                userData.extraleave=b
                leaveData.isextraleave=b
                 //console.log("hello word...2")
            }
            await leaveData.save()
            await userData.save()
        }
        await leaveData.save()
        
        //const userDetails=await User.findById({_id:userId})
        const userdata=await User.findByIdAndUpdate({_id: userId},
            {
               $push:{
                   takenLeave:leaveId
               }
           },
           {new:true}

           )
           res.status(200).json({
            success:true,
            data:userdata,
            message:"Leave Approve...."
           })

    } catch (error) {
      console.error(error)
      res.status(500).json({
      success: false,
      message: " Leave Not approval",
      error: error.message,
    })
    }
}

exports.Cancleleave=async(req,res)=>{
    try {
        const {leaveID,userID}=req.body
        const user=req.user.id
        console.log("user",user)
        const leaveDetails=await Leave.findOne({_id:leaveID})
         const userDetails1=await User.findById(userID)
        const userDetails=await User.findById(user)
        console.log("hello....1")
        const currentDate = new Date();



        if(leaveDetails.startdate.getTime() > currentDate.getTime()){
            console.log("hello....2",user.accountType)
            if(userDetails.accountType == "Employees"){
                console.log("hello....")

                await User.findByIdAndUpdate({_id:userID},
                {
                $pull:{
                    takenLeave:leaveDetails._id
                }
                },
                {new:true}
            )
            console.log("hello....4")
            // let userDetails=await User.findById(userID)
            // let leaveDetails=await Leave.findById(leaveID)
            if(leaveDetails.status){
                userDetails1.awailbleLeave=userDetails1.awailbleLeave+leaveDetails.isawailbleleave,
                userDetails1.extraleave=userDetails1.extraleave-leaveDetails.isextraleave
            }
            //userUpdate.awailbleLeave=userUpdate.awailbleLeave+1
            await userDetails1.save()
            await leaveDetails.save()
            //console.log("hello....3")
            //await Leave.findByIdAndDelete(leaveID)
            }
            await Leave.findByIdAndDelete(leaveID)

        }




        if(leaveDetails.startdate <= currentDate){
            if(userDetails.accountType == "Admin"){
                await User.findByIdAndUpdate({_id:userID},
            {
                $pop:{
                    leaveDetails:leaveID
                }
            },
            {new:true}
        )

               userDetails1.awailbleLeave=userDetails1.awailbleLeave+leaveDetails.isawailbleleave,
               userDetails1.extraleave=userDetails1.extraleave-leaveDetails.isextraleave
            }
            await userDetails1.save()
            await leaveDetails.save()
            await Leave.findByIdAndDelete(leaveID)

        }



        res.status(200).json({
            success:true,
            data:await Leave.findById(leaveID),
            message:"Successfull deleted..."
        })
        
    } catch (error) {
      console.error(error)
      res.status(500).json({
      success: false,
      message: " Leave Not Cancle",
      error: error.message,
    })
    }
}
