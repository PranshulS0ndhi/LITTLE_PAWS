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
  shelter: {
    type: mongoose.Schema.ObjectId,
    ref: 'Shelter',
  },
  pet: { 
    type: mongoose.Schema.ObjectId,
    ref: 'Pet',
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
    reasonToAdopt: { type: String, required: true },
    timeWithPet: { type: String, required: true },
    exercisePlan: { type: String, required: true },
    petExpenses: { type: String, required: true },
    vacationPlan: { type: String, required: true },
  },
  status: {
    type: String,
    enum: ['under-review', 'ai-reviewed', 'under-manual-review', 'accepted', 'rejected'],
    default: 'under-review',
  },
  aiReview: {
    verdict: { type: String },
    reason: { type: String },
    reviewType: { type: String, enum: ['complete', 'partial'] },
    reviewedAt: { type: Date },
  },
  submissionDate: {
    type: Date,
    default: Date.now,
  },
});

// Export the model
module.exports = mongoose.model('AdoptionForm', AdoptionFormSchema);
