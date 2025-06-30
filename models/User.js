// Import the Mongoose library
const mongoose = require("mongoose");

// Define the user schema using the Mongoose Schema constructor
const userSchema = new mongoose.Schema(
	{
		// Define the name field with type String, required, and trimmed
		firstName: {
			type: String,
			required: true,
			trim: true,
		},
		lastName:{
			type:String,
			required:true,
			trim:true
		},
		// Define the email field with type String, required, and trimmed
		email: {
			type: String,
			required: true,
			trim: true,
			lowercase: true
		},
		employeeId: {
			type: String,
		},
		// Define the password field with type String and required
		password: {
			type: String,
			required: true,
		},
		// Define the role field with type String and enum values of "Admin", "Student", or "Visitor"
		accountType: {
			type: String,
			enum: ["Admin", "Employees"],
			required: true,
		},
        takenLeave: [{
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: "Leave",
		}],
		awailbleLeave: 
			{
				type: Number,
				default:2,
			},
		creditleave:{
			type:Number,
			default:0
		},
		extraleave:{type:Number,default:0},
		Totalleave:{
			type:Number,
			default:0
		},
        token: {
			type: String,
		},
		image:{
			type:String
		}
		

		// Add timestamps for when the document is created and last modified
	}
);

// Export the Mongoose model for the user schema, using the name "user"
module.exports = mongoose.model("User", userSchema);