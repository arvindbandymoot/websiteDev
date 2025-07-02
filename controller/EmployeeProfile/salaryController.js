const SalarySlip = require('../models/SalarySlip');
const generatePDF = require('../utils/pdfGenerator');
const sendSalarySlip = require('../utils/mailSender');
const User = require('../models/User');
const SalarySlip = require('../models/SalarySlip');

// Create
exports.createSalarySlip = async (req, res) => {
  try {
    const slip = new SalarySlip(req.body);
    await slip.save();
     const existingSlip = await User.findOne({employeeId: req.body.employeeId},
      {
        $push: {
          SalarySlip: slip._id
         },
      },
      {new: true}
     );

    return res.status(201).json({
      success: true,
      message: 'Salary slip created successfully',  
      slip,
      existingSlip
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Read All
exports.getAllSalarySlips = async (req, res) => {
  try {
    const slips = await SalarySlip.find({});
  if (!slips || slips.length === 0) {
    return res.status(404).json({ error: 'No salary slips found' });
  }
  return res.status(200).json({
    success: true,
    message: 'Salary slips retrieved successfully',
    slips
  });
  } catch (error) {
    console.error('Error fetching salary slips:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Read One
exports.getSalarySlipById = async (req, res) => {
  try {
    const slip = await SalarySlip.findById({employeeId: req.params.id});
    if (!slip) {
      return res.status(404).json({ error: 'Salary slip not found' });
    }
    return res.status(200).json({
      success: true,
      message: 'Salary slip retrieved successfully',
      slip
    });
  } catch {
    res.status(404).json({ error: 'Not found' });
  }
};

// Update
exports.updateSalarySlip = async (req, res) => {
  try {
    const {employeeId,salaryId}=req.body;
    if (!employeeId || !salaryId) {
      return res.status(400).json({ error: 'Employee ID and Salary ID are required' });
    }
    const updated = await SalarySlip.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete
exports.deleteSalarySlip = async (req, res) => {
  await SalarySlip.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted successfully' });
};

// Admin-only Update
exports.adminUpdateEmployeeDetails = async (req, res) => {
  try {
    const updated = await SalarySlip.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Generate PDF + Email
exports.sendSalarySlipEmail = async (req, res) => {
  try {
    const slip = await SalarySlip.findById(req.params.id);
    if (!slip) return res.status(404).json({ error: 'Not found' });

    const pdfBuffer = await generatePDF(slip);
    await sendSalarySlip(req.body.email, pdfBuffer);

    res.json({ message: 'Salary slip sent successfully.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
