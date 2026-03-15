const express = require('express');
const router = express.Router();
const { createShelterAdmin } = require('../controllers/admin.controller');

// Internal use only - no middleware for now as requested for "ease of creation"
router.post('/create-shelter-admin', createShelterAdmin);

module.exports = router;
