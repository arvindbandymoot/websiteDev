const User = require('../../models/User')
const Leave = require('../../models/Leave')
const leaveInfo = require('../../models/LeaveInfo')
const cron = require('node-cron');
exports.leave = async (req, res) => {
    try {
        const { startdate, enddate, leaveType, description } = req.body
        const Userid = req.user.id
        const user = await User.findById(Userid)
        const name = user.firstName + " " + user.lastName
        const email = user.email
        //console.log("hello",startdate,enddate,leaveType,description)  
        //console.log("hello",startdate,enddate,leaveType,description,name,email)
        //console.log("hellow",name,Userid)
        if (!leaveType || !startdate || !enddate || !description) {
            return res.status(403).send({
                success: false,
                message: "All Field are required"
            })
        }
        console.log("starte", startdate)
        const startdate1 = new Date(startdate)
        const enddate1 = new Date(enddate)
        console.log("Newdate", startdate1)
        const newleave = await Leave.create({ name, email, startdate: startdate1, enddate: enddate1, leaveType, userId: Userid, description })
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
exports.approval = async (req, res) => {
    try {
        const { status, leaveId, userId } = req.body
        if (!status || !leaveId || !userId) {
            return res.status(403).send({
                success: false,
                message: "All Field are required"
            })
        }
        if (req.user.accountType == "Employees") {
            return res.status(500).json({
                success: false,
                message: "Only admin approve the lleave"
            })
        }
        if (status == "Rejected") {
            const leaveData = await Leave.findById(leaveId)
            const userData = await User.findById(userId)
            leaveData.status = status
            await leaveData.save()
            await leaveInfo.findByIdAndUpdate({ _id: userData.leaveDetails },
                {
                    $push: {
                        takenLeave: leaveData._id
                    }
                },
                { new: true }
            )
            return res.status(200).json({
                success: true,
                data: leaveData,
                message: "Leave Rejected...."
            })
        }

        let leaveData = await Leave.findById(leaveId)
        const userData = await User.findById({_id: userId.leaveDetails})
        leaveData.status = status
        //await leaveData.save()
        if (leaveData.enddate.getTime() == leaveData.startdate.getTime()) {
            const today = leaveData.startdate; // current date
            const threeDaysBefore = new Date();
            threeDaysBefore.setDate(today.getDate() - 3);
            const leavedatabefore = await Leave.findOne({ userId: userId, startdate: { $gte: threeDaysBefore } })
            const date = leaveData.startdate; // Example date
            const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            const dayOfWeek = days[date.getDay()];
            if (dayOfWeek == "Sunday") {
                if (days[leavedatabefore.startdate.getDay()] == "Thursday" && leavedatabefore.status == "Approved") {
                    if (userData.awailbleLeave > 0) {
                        var leaveNumber = userData.awailbleLeave - 1
                        userData.awailbleLeave = leaveNumber
                        userData.extraleave = userData.extraleave + 2
                        leaveData.isawailbleleave = 1
                        leaveData.isextraleave = 2
                    }
                    else {
                        userData.extraleave = userData.extraleave + 3
                        leaveData.isextraleave = 3
                    }
                }
                else {
                if (userData.awailbleLeave > 0) {
                    var leaveNumber = userData.awailbleLeave - 1
                    userData.awailbleLeave = leaveNumber
                    leaveData.isawailbleleave = 1
                }
                else {
                    userData.extraleave = userData.extraleave + 1
                    leaveData.isextraleave = 1
                }
               }
            }
            else {
                if (userData.awailbleLeave > 0) {
                    var leaveNumber = userData.awailbleLeave - 1
                    userData.awailbleLeave = leaveNumber
                    leaveData.isawailbleleave = 1
                }
                else {
                    userData.extraleave = userData.extraleave + 1
                    leaveData.isextraleave = 1
                }
            }
            await userData.save()
            await leaveData.save()
        }
        else {
            const date1 = leaveData.startdate;
            const date2 = leaveData.enddate;

            // Difference in milliseconds
            const diffInMs = date2 - date1;

            // Convert to days
            const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
            console.log("defferent days", diffInDays)
            const userData = await User.findById(userId)
            console.log("defferent days12")

            if (userData.awailbleLeave > 0) {
                let a = diffInDays - userData.awailbleLeave
                userData.extraleave = a
                leaveData.isawailbleleave = userData.awailbleLeave
                leaveData.isextraleave = a
                userData.awailbleLeave = 0
            }
            else {
                //const userData1=await User.findById(userId)
                console.log("hello word...")
                let b = userData.extraleave + diffInDays
                //console.log(b)
                //console.log("hello word...1")
                userData.extraleave = b
                leaveData.isextraleave = b
                //console.log("hello word...2")
            }
            await leaveData.save()
            await userData.save()
        }
        await leaveData.save()

        const leaveUpadte = await leaveInfo.findByIdAndUpdate({ _id: userData.leaveDetails },
            {
                $push: {
                    takenLeave: leaveData._id
                }
            },
            { new: true }
        )
        //const userDetails=await User.findById({_id:userId})
        res.status(200).json({
            success: true,
            data: leaveUpadte,
            message: "Leave Approve...."
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

exports.Cancleleave = async (req, res) => {
    try {
        const { leaveID, userID } = req.body
        const user = req.user.id
        console.log("user", user)
        const leaveDetails = await Leave.findOne({ _id: leaveID })
        if (leaveDetails.status == "Pending") {
            return res.status(404).json({
                success: false,
                message: "cannot cancle leave, it is still pending"
            })
        }
        const userDetails1 = await User.findById({ _id: userID.leaveDetails })
        const userDetails = await User.findById(user)
        console.log("hello....1")
        const currentDate = new Date();



        if (leaveDetails.startdate.getTime() > currentDate.getTime()) {
            console.log("hello....2", user.accountType)
            if (userDetails.accountType == "Employees") {
                console.log("hello....")

                await leaveInfo.findByIdAndUpdate({ _id: userID.leaveDetails },
                    {
                        $pull: {
                            takenLeave: leaveDetails._id
                        }
                    },
                    { new: true }
                )
                console.log("hello....4")
                // let userDetails=await User.findById(userID)
                // let leaveDetails=await Leave.findById(leaveID)
                if (leaveDetails.status== "Approved") {
                    userDetails1.awailbleLeave = userDetails1.awailbleLeave + leaveDetails.isawailbleleave,
                    userDetails1.extraleave = userDetails1.extraleave - leaveDetails.isextraleave
                }
                //userUpdate.awailbleLeave=userUpdate.awailbleLeave+1
                await userDetails1.save()
                await leaveDetails.save()
                //console.log("hello....3")
                //await Leave.findByIdAndDelete(leaveID)
            }
            await Leave.findByIdAndDelete(leaveID)

        }




        if (leaveDetails.startdate <= currentDate) {
            if (userDetails.accountType == "Admin") {
                await User.findByIdAndUpdate({ _id: userID },
                    {
                        $pop: {
                            leaveDetails: leaveID
                        }
                    },
                    { new: true }
                )
                if( leaveDetails.status == "Approved") {
                userDetails1.awailbleLeave = userDetails1.awailbleLeave + leaveDetails.isawailbleleave,
                userDetails1.extraleave = userDetails1.extraleave - leaveDetails.isextraleave
                }
                
            }
            await userDetails1.save()
            await leaveDetails.save()
            await Leave.findByIdAndDelete(leaveID)

        }



        res.status(200).json({
            success: true,
            data: await Leave.findById(leaveID),
            message: "Successfull deleted..."
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
