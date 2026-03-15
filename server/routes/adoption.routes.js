const express = require('express');
const router = express.Router();
const { submitAdoption, getAdoptionStatus } = require('../controllers/adoption.controller');

// Submit a new application
router.post('/submit', submitAdoption);

// Check application status
router.get('/status/:id', getAdoptionStatus);

module.exports = router;
