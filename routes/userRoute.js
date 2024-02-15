const express = require("express");
const router = express.Router();

// Import modelu użytkownika
const User = require('../models/user');

// Endpoint obsługujący rejestrację nowego użytkownika
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Tworzenie nowego obiektu użytkownika na podstawie przekazanych danych
        const newUser = new User({ username, email, password });

        // Zapis nowego użytkownika do bazy danych
        const savedUser = await newUser.save();

        // Wysłanie odpowiedzi potwierdzającej rejestrację
        res.json({ message: 'Registration successful', user: savedUser });
    } catch (error) {
        // Obsługa błędów rejestracji
        console.error('Registration Error:', error);
        res.status(500).json({ error: 'Registration failed' });
    }
});

// Endpoint obsługujący logowanie użytkownika
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Sprawdzenie, czy istnieje użytkownik o podanym adresie email i haśle
        const user = await User.findOne({ email, password });

        if (user) {
            // Przygotowanie obiektu użytkownika do przesłania jako odpowiedź
            const userInfo = {
                username: user.username,
                email: user.email,
                isAdmin: user.isAdmin,
                _id : user._id
            };

            // Wysłanie odpowiedzi z informacjami o zalogowanym użytkowniku
            res.send(userInfo);
        } else {
            // Odpowiedź w przypadku błędnych danych logowania
            res.status(400).json({ message: 'Incorrect login credentials' });
        }
    } catch (error) {
        // Obsługa błędów logowania
        console.error('Login Error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});


router.get("/getallusers", async(req, res)=>{
    try {
        const users = await User.find()
        res.send(users)
        
    } catch (error) {
        return res.status(400).json({error})
        
    }
})

// Eksportuje router do użycia w innych częściach aplikacji
module.exports = router;
