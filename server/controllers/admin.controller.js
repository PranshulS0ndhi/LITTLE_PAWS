const User = require('../models/User');
const Shelter = require('../models/shelter.model');
const bcrypt = require('bcryptjs');

const createShelterAdmin = async (req, res) => {
    try {
        const { userName, email, password, city } = req.body;

        // Check if user already exists
        let user = await User.findOne({ 
            $or: [{ email }, { userName }] 
        });
        
        if (user) {
            return res.status(400).json({ success: false, message: "User already exists." });
        }

        // Find the shelter for this city
        const shelter = await Shelter.findOne({ city });
        if (!shelter) {
            return res.status(404).json({ success: false, message: "Shelter for this city does not exist." });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create user
        user = new User({
            userName,
            email,
            password: hashedPassword,
            role: 'shelterAdmin',
            city
        });

        await user.save();

        // Assign this user as the shelter admin
        shelter.shelterAdmin = user._id;
        await shelter.save();

        res.status(201).json({
            success: true,
            message: "Shelter admin created successfully and assigned to shelter.",
            user: {
                id: user._id,
                userName: user.userName,
                email: user.email,
                role: user.role,
                city: user.city
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error creating shelter admin", error: error.message });
    }
};

module.exports = { createShelterAdmin };
