const express = require('express');
const router = express.Router();
const { submitAdoption, getAdoptionStatus, getUserApplications } = require('../controllers/adoption.controller');
const { verifyUser } = require('../middlewares/auth.middleware');

// Submit a new application
router.post('/submit', verifyUser, submitAdoption);

// Get user applications
router.get('/my-applications', verifyUser, getUserApplications);

// Check application status by ID
router.get('/status/:id', getAdoptionStatus);

module.exports = router;
