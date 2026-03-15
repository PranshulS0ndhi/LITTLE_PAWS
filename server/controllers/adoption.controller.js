const AdoptionForm = require('../models/adoptionForm.model');
const redis = require('../helpers/redisClient');

const submitAdoption = async (req, res) => {
    try {
        const adoptionData = {
            ...req.body,
            user: req.user ? req.user.id : null, // Handle auth if available
            status: 'under-review'
        };

        const newApplication = new AdoptionForm(adoptionData);
        await newApplication.save();

        // Push to Redis queue
        await redis.rpush('adoption_queue', newApplication._id.toString());

        res.status(201).json({
            success: true,
            status: 'under-review',
            message: 'Application submitted and is being reviewed by AI.',
            applicationId: newApplication._id
        });
    } catch (error) {
        console.error('Error submitting adoption:', error);
        res.status(500).json({
            success: false,
            message: 'Error submitting application',
            error: error.message
        });
    }
};

const getAdoptionStatus = async (req, res) => {
    try {
        const application = await AdoptionForm.findById(req.params.id);
        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'Application not found'
            });
        }

        res.status(200).json({
            success: true,
            status: application.status,
            aiReview: application.aiReview
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching application status',
            error: error.message
        });
    }
};

module.exports = {
    submitAdoption,
    getAdoptionStatus
};
