const mongoose = require("mongoose");

// Definicja schematu danych dla użytkownika
const userSchema = mongoose.Schema({
    // Nazwa użytkownika
    username: {
        type: String,
        required: true
    },
    // Adres email użytkownika
    email: {
        type: String,
        required: true
    },
    // Hasło użytkownika
    password: {
        type: String,
        required: true
    },
    // Status administratora (domyślnie false)
    isAdmin: {
        type: Boolean,
        default: false
    },
}, {
    // Opcje, w tym ustawienie automatycznego generowania znaczników czasu
    timestamps: true,
    // Nazwa kolekcji w bazie danych (opcjonalne)
    collection: 'users'
});

// Tworzenie modelu 'User' na podstawie zdefiniowanego schematu
const User = mongoose.model('User', userSchema);

// Eksportowanie modelu 'User' do użycia w innych częściach aplikacji
module.exports = User;
