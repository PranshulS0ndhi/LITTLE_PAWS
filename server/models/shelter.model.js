const mongoose = require('mongoose');

const shelterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  city: { type: String, required: true, unique: true }, 
   shelterAdmin : {type : mongoose.Schema.ObjectId , ref : 'User'},
   contact: { type: String },
   aiReviewMode: { type: String, enum: ['complete', 'partial'], default: 'complete' }
 });

const Shelter = mongoose.model('Shelter', shelterSchema);
module.exports = Shelter
