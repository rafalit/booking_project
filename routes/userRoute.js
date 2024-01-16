const express = require("express");
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');

router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({ username, email, password: hashedPassword });
        const savedUser = await newUser.save();

        res.json({ message: 'Registration successful', user: savedUser });
    } catch (error) {
        console.error('Registration Error:', error);
        res.status(500).json({ error: 'Registration failed' });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find the user by email
        const user = await User.findOne({ email });

        if (user) {
            // Compare the entered password with the hashed password in the database
            const passwordMatch = await bcrypt.compare(password, user.password);

            if (passwordMatch) {
                const temp = {
                    username: user.username,
                    email: user.email,
                    isAdmin: user.isAdmin,
                    _id: user._id
                };

                res.json(temp);
            } else {
                res.status(400).json({ message: 'Incorrect login credentials' });
            }
        } else {
            res.status(400).json({ message: 'Incorrect login credentials' });
        }
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});

module.exports = router;
