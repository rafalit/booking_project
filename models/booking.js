const mongoose = require("mongoose");

// Definicja schematu danych dla rezerwacji
const bookingSchema = mongoose.Schema({
    // Identyfikator pokoju - referencja do innego modelu 'Room'
    name: {
        type: String,
        required: true
    },
    roomid:{
        type:String,
        required:true,
    },

    // Identyfikator użytkownika
    userid: {
        type: String,
        required: true
    },
    // Data początkowa rezerwacji
    fromDate: {
        type: Date,
        required: true
    },
    // Data końcowa rezerwacji
    toDate: {
        type: Date,
        required: true
    },
    // Całkowita kwota rezerwacji
    totalamount: {
        type: Number,
        required: true
    },
    // Całkowita liczba dni rezerwacji
    totalDays: {
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