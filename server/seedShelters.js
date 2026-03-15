const mongoose = require('mongoose');
const Shelter = require('./models/shelter.model');
require('dotenv').config();

const shelters = [
  { name: 'shelter_chandigarh', city: 'Chandigarh', contact: '1234567890' },
  { name: 'shelter_panchkula', city: 'Panchkula', contact: '0987654321' },
  { name: 'shelter_mohali', city: 'Mohali', contact: '1122334455' }
];

async function seedShelters() {
  try {
    await mongoose.connect(process.env.MONGODB_URL || 'mongodb://localhost:27017/lil_paws');
    console.log('Connected to MongoDB');

    for (const s of shelters) {
      await Shelter.findOneAndUpdate(
        { city: s.city },
        s,
        { upsert: true, new: true }
      );
      console.log(`Synced shelter for ${s.city}`);
    }

    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding shelters:', error);
  }
}

seedShelters();
