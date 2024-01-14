const express = require("express");
const router = express.Router();

const User = require('../models/user');

router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const newUser = new User({ username, email, password });
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
        const user = await User.findOne({ email, password });

        if (user) {
            const temp = {
                username: user.username,
                email: user.email,
                isAdmin: user.isAdmin,
                _id : user._id
            }

           res.send(temp);
        } else {
            res.status(400).json({ message: 'Incorrect login credentials' });
        }
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});

module.exports = router;
