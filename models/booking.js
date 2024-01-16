const mongoose = require("mongoose");

// Definicja schematu danych dla rezerwacji
const bookingSchema = mongoose.Schema({
    // Identyfikator pokoju - referencja do innego modelu 'Room'
    room: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room',
        required: true
    },
    // Identyfikator użytkownika
    userid: {
        type: String,
        required: true
    },
    // Data początkowa rezerwacji
    fromDate: {
        type: String,
        required: true
    },
    // Data końcowa rezerwacji
    toDate: {
        type: String,
        required: true
    },
    // Całkowita kwota rezerwacji
    totalamount: {
        type: Number,
        required: true
    },
    // Całkowita liczba dni rezerwacji
    totaldays: {
        type: Number,
        required: true
    },
    // Identyfikator transakcji
    transactionid: {
        type: String,
        required: true
    },
    // Status rezerwacji, domyślnie ustawiony na "booked"
    status: {
        type: String,
        required: true,
        default: "booked"
    }
}, {
    // Opcje, w tym ustawienie automatycznego generowania znaczników czasu
    timestamps: true
});

// Tworzenie modelu 'Booking' na podstawie zdefiniowanego schematu
const Booking = mongoose.model('Booking', bookingSchema);

// Eksportowanie modelu 'Booking' do użycia w innych częściach aplikacji
module.exports = Booking;
