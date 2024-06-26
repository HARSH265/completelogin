const User = require("../model/userModel");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../utils/jwt");

const handleRegisterUser = async (req, res) => {
    const { first_name, second_name, email, password, isAdmin } = req.body;

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = new User({
            first_name,
            second_name,
            email,
            password: hashedPassword,
            isAdmin
        });

        // Save the user to the database
        const savedUser = await newUser.save();

        const token = generateToken(savedUser);

        // Return the saved user data (excluding password)
        return res.status(201).json({
            user: {
                id: savedUser._id,
                first_name: savedUser.first_name,
                second_name: savedUser.second_name,
                email: savedUser.email,
                isAdmin: savedUser.isAdmin
            },
            token
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
};

const handleUserLogin = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email" });
        }

        // Compare the provided password with the stored hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const token = generateToken(user);

        // If passwords match, return success response
        return res.status(200).json({
            message: "Login successful",
            user: {
                id: user._id,
                first_name: user.first_name,
                second_name: user.second_name,
                email: user.email,
                isAdmin: user.isAdmin,
            },
            token
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
};

module.exports = { handleRegisterUser, handleUserLogin };
