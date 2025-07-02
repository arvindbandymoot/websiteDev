const Employee = require('../models/Employee');
const mongoose = require('mongoose');
const User = require('../models/User');

// Create new employee
// exports.createEmployee = async (req, res) => {
//   try {
//     const employee = new Employee(req.body);
//     await employee.save();
//     res.status(201).json(employee.getPublicProfile());
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// };

// Get all employees
exports.getAllEmployees = async (req, res) => {
  try {
    const employees = await User.find({}).populate('additionalDetails').exce();
    if (!employees || employees.length === 0) {
      return res.status(404).json({ error: 'No employees found' });
    }
    return res.status(200).json({
      success: true,
      message: 'Employees fetched successfully',
      data:employees,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get employee by ID
exports.getEmployeeById = async (req, res) => {
  try {
    const { employeeId } = req.body;
    const employee = await User.findOne({employeeId: employeeId}).populate('additionalDetails');
    if (!employee) return res.status(404).json({ error: 'Employee not found' });
   return res.status(200).json({
      success: true,  
      message: 'Employee fetched successfully',
      data: employee,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update employee
exports.updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if ID is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid Employee ID' });
    }

    // Optional: whitelist fields to avoid unwanted updates
    // For deep/nested updates, make sure the client sends correctly structured data
    const updates = req.body;

    // Perform update
    const employee = await Employee.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    res.status(200).json({
      message: 'Employee updated successfully',
      employee,
    });
  } catch (error) {
    console.error('Update Error:', error.message);
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
};
// Delete employee
// exports.deleteEmployee = async (req, res) => {
//   try {
//     const employee = await Employee.findByIdAndDelete(req.params.id);
//     if (!employee) return res.status(404).json({ error: 'Employee not found' });
//     res.json({ message: 'Employee deleted successfully' });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };
