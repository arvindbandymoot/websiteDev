const SalarySlip = require('../models/SalarySlip');
const generatePDF = require('../utils/pdfGenerator');
const sendSalarySlip = require('../utils/mailSender');

// Create
exports.createSalarySlip = async (req, res) => {
  try {
    const slip = new SalarySlip(req.body);
    await slip.save();
    res.status(201).json(slip);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Read All
exports.getAllSalarySlips = async (req, res) => {
  const slips = await SalarySlip.find();
  res.json(slips);
};

// Read One
exports.getSalarySlipById = async (req, res) => {
  try {
    const slip = await SalarySlip.findById(req.params.id);
    res.json(slip);
  } catch {
    res.status(404).json({ error: 'Not found' });
  }
};

// Update
exports.updateSalarySlip = async (req, res) => {
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
