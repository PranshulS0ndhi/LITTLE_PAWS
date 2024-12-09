const Pet = require('../models/pets.model');
const Shelter = require('../models/shelter.model')
const {imageUploadUtil} = require('../helpers/cloudinary')
const AdoptionForm = require('../models/adoptionForm.model')
const sendAdoptionApplication = require('../helpers/kafkaProducer')

const reportStray =  async (req, res) => {
    try {
      const { name, type, breed, description, age, city } = req.body;
  
      
      if (!name || !type || !breed || !city || !age) {
        return res.status(400).json({ message: "All required fields must be filled" });
      }
  
     
      const validCities = ["Chandigarh", "Mohali", "Panchkula"];
      if (!validCities.includes(city)) {
        return res.status(400).json({ message: "Invalid city selected" });
      }
  
      
      const shelter = await Shelter.findOne({ city });
      if (!shelter) {
        return res.status(404).json({ message: "Shelter not found for the selected city" });
      }
  
      
      const uploadedPictures = [];
      if (req.files) {
        for (const file of req.files) {
          const fileData = file.buffer.toString("base64");
          const uploadResult = await imageUploadUtil(`data:${file.mimetype};base64,${fileData}`);
          uploadedPictures.push(uploadResult.secure_url);
        }
      }
  
      
      const newPet = new Pet({
        name,
        type,
        breed,
        description,
        age,
        region: city,
        pictures: uploadedPictures,
        shelter: shelter._id, 
        foster: req.user.id, 
      });
  
      
      await newPet.save();
  
    
      res.status(201).json({
        message: "Stray animal reported successfully",
        pet: newPet,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error reporting stray animal", error: error.message });
    }
  }

const getApplicationStatus = async (req, res) => {
  try {
    const { id: userId } = req.user; 

    
    const adoptionForms = await AdoptionForm.find({ user: userId });

    if (adoptionForms.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No adoption applications found for this user.",
      });
    }

    
    res.status(200).json({
      success: true,
      message: "Adoption applications retrieved successfully.",
      applications: adoptionForms,
    });
  } catch (error) {
    console.error("Error fetching adoption applications:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching adoption applications.",
      error: error.message,
    });
  }
}

// const sendForm = async (req, res) => {
//   try {
//     const { petId } = req.params;
//     const { id: userId } = req.user; 
   
    
//     const { 
//       city, 
//       personalInfo, 
//       livingConditions, 
//       petExperience, 
//       adoptionDetails 
//     } = req.body;

   
//     const pet = await Pet.findById(petId);
//     if (!pet) {
//       return res.status(404).json({ success: false, message: "Pet not found" });
//     }


//     console.log(userId , petId);
    
//     const existingForm = await AdoptionForm.findOne({ user: userId, pet: petId });
//     console.log(existingForm);
//     if (existingForm) {
//       return res.status(400).json({ success: false, message: "You have already submitted an adoption form for this pet." });
//     }

    
//     const adoptionForm = new AdoptionForm({
//       user: userId,
//       pet: petId,
//       city,
//       personalInfo,
//       livingConditions,
//       petExperience,
//       adoptionDetails,
//     });

    
//     const savedForm = await adoptionForm.save();

    
//     res.status(201).json({
//       success: true,
//       message: "Adoption form submitted successfully.",
//       adoptionForm: savedForm,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: "Error submitting adoption form.", error: error.message });
//   }
// }
const sendForm = async (req, res) => {
  try {
    const { petId } = req.params;
    const { id: userId } = req.user; 
   
    const { 
      city, 
      personalInfo, 
      livingConditions, 
      petExperience, 
      adoptionDetails 
    } = req.body;

   
    const pet = await Pet.findById(petId);
    if (!pet) {
      return res.status(404).json({ success: false, message: "Pet not found" });
    }

    console.log(userId, petId);

    
    const existingForm = await AdoptionForm.findOne({ user: userId, pet: petId });
    console.log(existingForm);
    if (existingForm) {
      return res.status(400).json({ success: false, message: "You have already submitted an adoption form for this pet." });
    }

   
    const adoptionForm = new AdoptionForm({
      user: userId,
      pet: petId,
      city,
      personalInfo,
      livingConditions,
      petExperience,
      adoptionDetails,
    });

    
    const savedForm = await adoptionForm.save();

   
    await sendAdoptionApplication(savedForm);

    
    res.status(201).json({
      success: true,
      message: "Adoption form submitted successfully.",
      adoptionForm: savedForm,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error submitting adoption form.", error: error.message });
  }
};

module.exports = {reportStray , getApplicationStatus , sendForm}  
