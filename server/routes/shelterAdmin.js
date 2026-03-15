const {Router} = require('express');

 const { viewApplications,
        acceptApplication,
        rejectApplication,
        setReviewMode,
        getReviewMode } = require('../controllers/applications.controller');
const { verifyShelterAdmin } = require('../middlewares/auth.middleware');


const router = Router();



router.get('/applications' , verifyShelterAdmin,viewApplications)

router.put('/applications/:appId', verifyShelterAdmin , acceptApplication);

router.put('/applications/reject/:appId', verifyShelterAdmin , rejectApplication);

router.get('/review-mode', verifyShelterAdmin, getReviewMode);
router.put('/review-mode', verifyShelterAdmin, setReviewMode);

module.exports = router;