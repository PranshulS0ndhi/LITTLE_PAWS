const mongoose = require('mongoose');

const petSchema = new mongoose.Schema({
    pictures: [{ type: String }],
    name: { type: String, required: true },
    type: { type: String, required: true }, 
    breed: { type: String, required: true },
    description : {type : String},
    age: { type: Number, required: true }, 
    region: { type: String, required: true }, 
    foster: {
        type: mongoose.Schema.ObjectId,
        ref: 'User', 
        required: false,
    },
    shelter: {
        type: mongoose.Schema.ObjectId,
        ref: 'Shelter',
        required: true
    }
});

module.exports = mongoose.model('Pet', petSchema);
