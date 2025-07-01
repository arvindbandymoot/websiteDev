const express = require('express');
const router = express.Router();
const {
  createSalarySlip,
  getAllSalarySlips,
  getSalarySlipById,
  updateSalarySlip,
  deleteSalarySlip,
  adminUpdateEmployeeDetails,
  sendSalarySlipEmail
} = require('../controllers/salaryController');

// CRUD
router.post('/:id', createSalarySlip);
router.get('/:id', getAllSalarySlips);
router.get('/:id', getSalarySlipById);
router.put('/:id', updateSalarySlip);
router.delete('/:id', deleteSalarySlip);

// Admin-only
router.put('/employee/:id',auth, isAdmin, adminUpdateEmployeeDetails);

// PDF Email
router.post('/:id/send-slip', sendSalarySlipEmail);

module.exports = router;
