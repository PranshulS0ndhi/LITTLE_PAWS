const {Router} = require('express');
const Pet = require('../models/pets.model');
const { upload } = require('../helpers/cloudinary');
const { verifyUser } = require('../middlewares/auth.middleware');
const { reportStray,
        getApplicationStatus,
        sendForm } = require('../controllers/user.controller');
const router = Router();

router.post('/report-stray', verifyUser, upload.array("pictures", 5), reportStray);
  
router.post('/adopt/:petId', verifyUser, sendForm);

router.get('/adoption-status' , verifyUser , getApplicationStatus )
  

module.exports = router;