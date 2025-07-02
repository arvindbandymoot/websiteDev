const express = require('express');
const router = express.Router();
const {
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee
} = require('../controller/employeeController');
const { auth, isAdmin,isEmployees } = require('../middleware/auth');

//router.post('/:id', createEmployee);
router.get('/:id',auth,isAdmin, getAllEmployees);
router.get('/:id',auth,isAdmin, getEmployeeById);
router.put('/:id',auth,isEmployees, updateEmployee);
router.delete('/:id', deleteEmployee);

module.exports = router;
