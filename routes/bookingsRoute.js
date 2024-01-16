const express = require("express");
const router = express.Router();
const Booking = require('../models/booking');

// Endpoint obsługujący rezerwację pokoju
router.post("/bookroom", async (req, res) => {
    try {
        // Dekonstruowanie danych przesłanych w żądaniu
        const { room, userid, fromDate, toDate, totalamount, totalDays } = req.body;

        // Wyświetlenie informacji o przyjętym żądaniu rezerwacji
        console.log("Received booking request:", req.body);

        // Tworzenie nowego obiektu rezerwacji na podstawie przekazanych danych
        const newBooking = new Booking({
            room: {
                name: room.name,
                _id: room._id,
            },
            userid,
            fromDate,
            toDate,
            totalamount,
            totalDays,
            transactionId: "1234", // Przykładowy identyfikator transakcji
        });

        // Zapis nowej rezerwacji do bazy danych
        const booking = await newBooking.save();

        // Wysłanie odpowiedzi z potwierdzeniem udanej rezerwacji
        res.status(200).json({ message: "Room booked successfully", booking });
    } catch (error) {
        console.error("Error while booking room:", error);

        // Obsługa błędów podczas rezerwacji
        if (error.name === 'ValidationError') {
            // Walidacja nie powiodła się - błąd klienta
            res.status(400).json({ message: "Validation failed", errors: error.errors });
        } else {
            // Inny błąd - błąd serwera
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
});

// Eksportuje router do użycia w innych częściach aplikacji
module.exports = router;
