const mongoose = require('mongoose');

// Adoption Form Schema
const AdoptionFormSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  city: {
    type: String,
  },
  personalInfo: {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    altPhone: { type: String },
    address: { type: String, required: true },
    occupation: { type: String, required: true },
    workingHours: { type: String, required: true },
  },
  livingConditions: {
    residenceType: { type: String, required: true },
    ownershipStatus: { type: String, required: true },
    hasYard: { type: Boolean, default: false },
    yardFenced: { type: Boolean, default: false },
    householdMembers: { type: String, required: true },
    childrenAges: { type: String },
    landlordContact: { 
      type: String, 
      required: function () { return this.ownershipStatus === 'Rent'; } 
    },
    moveFrequency: { type: String, required: true },
  },
  petExperience: {
    currentPets: { type: String },
    previousPets: { type: String, required: true },
    vetName: { type: String },
    vetContact: { type: String },
    petAllergies: { type: String },
    trainingExperience: { type: String, required: true },
  },
  adoptionDetails: {
    petName: { type: String, required: true },
    reasonToAdopt: { type: String, required: true },
    timeWithPet: { type: String, required: true },
    exercisePlan: { type: String, required: true },
    emergencyPlan: { type: String },
    adjustmentPlan: { type: String },
    petExpenses: { type: String, required: true },
    vacationPlan: { type: String, required: true },
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  submissionDate: {
    type: Date,
    default: Date.now,
  },
});

// Export the model
module.exports = mongoose.model('AdoptionForm', AdoptionFormSchema);
