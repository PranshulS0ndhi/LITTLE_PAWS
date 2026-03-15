const Applications = require('../models/adoptionForm.model')
const User = require('../models/User')


const viewApplications = async (req, res) => {
    try {
      const { id: shelterAdminId } = req.user;
  
      console.log("Shelter Admin ID:", shelterAdminId);
  
      // Fetch the shelter admin's details to get the city
      const shelterAdmin = await User.findById(shelterAdminId);
      console.log(shelterAdmin);
      console.log(shelterAdmin.city)
      if (!shelterAdmin) {
        return res.status(404).json({ message: "Shelter admin not found." });
      }
  
      const adminCity = shelterAdmin.city;
      console.log("Shelter Admin City:", adminCity);
  
      if (!adminCity) {
        return res.status(400).json({ message: "City is not associated with this admin." });
      }
  
      // Find applications for the admin's city
      // Only show applications that have been processed by AI (ai-reviewed or under-manual-review)
      const applications = await Applications.find({ 
        city: adminCity,
        status: { $in: ['ai-reviewed', 'under-manual-review', 'accepted', 'rejected'] }
      }).populate("user").populate("pet");
  
      console.log("Applications found:", applications);
  
      if (!applications.length) {
        return res.status(200).json({  // Change to 200 with empty array to avoid frontend error
          success: true,
          message: "No applications found for your city.",
          applications: []
        });
      }
  
      res.status(200).json({
        success: true,
        message: `Applications for city: ${adminCity}`,
        applications,
      });
    } catch (error) {
      console.error("Error fetching applications:", error);
      res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
  };




  const acceptApplication = async (req, res) => {
    const applicationId = req.params.appId;

    try {
        const updatedApplication = await Applications.findByIdAndUpdate(
            applicationId,
            { status: 'accepted' }, 
            { new: true } 
        );

        if (!updatedApplication) {
            return res.status(404).json({
                message: "Application not found.",
            });
        }

        res.status(200).json({
            message: "Application approved!",
            application: updatedApplication,
        });
    } catch (error) {
        console.error('Error approving application:', error);
        res.status(500).json({
            message: "Internal Server Error",
        });
    }
};

const rejectApplication = async (req, res) => {
    const applicationId = req.params.appId;

    try {
        const updatedApplication = await Applications.findByIdAndUpdate(
            applicationId,
            { status: 'rejected' }, 
            { new: true } 
        );

        if (!updatedApplication) {
            return res.status(404).json({
                message: "Application not found.",
            });
        }

        res.status(200).json({
            message: "Application has been rejected!",
            application: updatedApplication,
        });
    } catch (error) {
        console.error('Error rejecting application:', error);
        res.status(500).json({
            message: "Internal Server Error",
        });
    }
};

// const acceptApplication = async (req, res) => {
//     const applicationId = req.params.appId;

//     try {
//         const updatedApplication = await Applications.findByIdAndUpdate(
//             applicationId,
//             { isApproved: true },
//             { new: true } 
//         );

//         if (!updatedApplication) {
//             return res.status(404).json({
//                 message: "Application not found.",
//             });
//         }

//         res.status(200).json({
//             message: "Application approved!",
//             application: updatedApplication,
//         });
//     } catch (error) {
//         console.error('Error approving application:', error);
//         res.status(500).json({
//             message: "Internal Server Error",
//         });
//     }
// }  

// const rejectApplication =  async (req, res) => {
//     const applicationId = req.params.appId;

//     try {
        
//         const updatedApplication = await Applications.findByIdAndUpdate(
//             applicationId,
//             { isApproved: false }, 
//             { new: true } 
//         );

//         if (!updatedApplication) {
//             return res.status(404).json({
//                 message: "Application not found.",
//             });
//         }

//         res.status(200).json({
//             message: "Application has been rejected!",
//             application: updatedApplication,
//         });
//     } catch (error) {
//         console.error('Error rejecting application:', error);
//         res.status(500).json({
//             message: "Internal Server Error",
//         });
//     }
// }

const setReviewMode = async (req, res) => {
    try {
        const { id: adminId } = req.user;
        const { mode } = req.body;

        if (!['complete', 'partial'].includes(mode)) {
            return res.status(400).json({ success: false, message: "Invalid mode." });
        }

        const shelter = await Shelter.findOneAndUpdate(
            { shelterAdmin: adminId },
            { aiReviewMode: mode },
            { new: true }
        );

        if (!shelter) {
            return res.status(404).json({ success: false, message: "Shelter not found for this admin." });
        }

        res.status(200).json({
            success: true,
            mode: shelter.aiReviewMode,
            message: `AI Review Mode updated to ${mode}`
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error updating review mode", error: error.message });
    }
};

const getReviewMode = async (req, res) => {
    try {
        const { id: adminId } = req.user;
        const shelter = await Shelter.findOne({ shelterAdmin: adminId });

        if (!shelter) {
            return res.status(404).json({ success: false, message: "Shelter not found." });
        }

        res.status(200).json({
            success: true,
            mode: shelter.aiReviewMode
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching review mode", error: error.message });
    }
};

module.exports = { viewApplications, acceptApplication, rejectApplication, setReviewMode, getReviewMode };