const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


const employeeSchema = new mongoose.Schema({
  employeeId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  employeeName: {
   firstName:{
    type: String,
     required: true,
   },
   lastName:{

    type:String, 
    required: true
  }
},
  department: {
    type: String,
    required: true,
    trim: true
  },
  costCenter: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  designation: {
    type: String,
    required: true,
    trim: true
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  dateOfJoining: {
    type: Date,
    required: true
  },
  residentialStatus: {
    type: String,
    enum: ['Resident', 'Non-Resident', 'Ordinarily Resident'],
    required: true
  },
  pfNumber: {
    type: String,
    required: true,
    trim: true
  },
  esiNumber: {
    type: String,
    required: true,
    trim: true
  },
  epsNumber: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
    trim: true
  },
  phoneNumber: {
    type: Number,
    trim: true
  },
  permanentAddress: {
    type: String,
    trim: true
  },
  currentAddress: {
    type: String,
    trim: true
  },
  bankDetails: {
    accountNumber: String,
    bankName: String,
    ifscCode: String,
    branchName: String,
    adhaarNumber: String,
    panNumber: String
  },
  bloodGroup: {
    type: String,
    trim: true
  },
  maritalStatus: {
    type: String,
    enum: ['Married','Single'],
    required: true,
    trim: true
  },
  dateOfMarriage:{
    type: Date,
    required: function(){
        return this.maritalStatus === 'Married';
    }
  },
  nationality:{
    type: String,
    required: true
  },
  secondaryEducation:{
    tenth:{
        schoolName: {
            type: String,
            required: true
        },
        board: String,
        yearOfPassing: Number,
        percentage: Number
    },
    twelfth:{
        schoolName:{
            type:String,
            required: true
        },
        board:String,
        yearOfPassing: Number,
        percentage: Number
    }
  },
  graduation:{
    collegeName: String,
    percentage: Number,
    CGPA: Number,
    Backlogs: String,
    graduationYear: Number
 },
  previousCompany:{
    companyName: String,
    position: String,
    teamLead: String,
    annualSalary: Number,
    startingDate: Date,
    endingDate: Date,
    reasonOfLeaving:String 
 },
  skills:{
    workExperience: Number,
    keySkills:String,
    keyAchivements:String,
    majorProject: String
  },
  professionalReference:{
    referenceName: String,
    relationship: String,
    phoneNumber: Number,
    email: String,
    Company: String,
    position: String
  },
  documents:{
    resume:{
        type: String,
        required: true
    },
    signature:{
        type: String,
        required: true
    },
    additionalDocs:{
        type:String
    }

  },
  accountType: {
    type: String,
    required: true,
    enum: {
      values: ['employee', 'admin'],
      message: 'Account type must be either employee or admin'
    },
    default: 'employee'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});


module.exports = mongoose.model('Employee', employeeSchema);