const mongoose=require('mongoose')
const leaveSchema=new mongoose.Schema(
    {
        name:{
            type:String,
            require:true
        },
        email:{
            type:String,
            require:true
        },
        startdate:{
            type:Date,
            default:Date.now
        },
        enddate:{
            type:Date,
            default:Date.now
        },
        description:{
            type:String,
            require:true
        },
        status:{
            type:Boolean,
            default:false
        },
        isawailbleleave:{
            type:Number,
            default:0
        },
        isextraleave:{
            type:Number,
            default:0
        },
        user: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: "User",
	    },
        createdAt: {
		type: Date,
		default: Date.now,
		//expires: 60 * 5, // The document will be automatically deleted after 5 minutes of its creation time
	},
    }
)
const Leave = mongoose.model("Leave", leaveSchema);

module.exports = Leave;