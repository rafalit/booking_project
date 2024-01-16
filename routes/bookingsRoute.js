const express = require("express");
const router = express.Router();
const Room = require('../models/room');
const mongoose = require("mongoose");
const stripe = require('stripe')('sk_test_51OYurRJuf3K9tPXcgKmaOKbrLYHbAkLrdLJNDWstwjFMF0p1M97MsBaiXrZZElVHyzsaI7Dges32QvAGIuVSXcPf00kA0NamgN');
const { v4: uuidv4 } = require('uuid');
const Booking = require('../models/booking');

router.post("/bookroom", async (req, res) => {
    const { room, userid, fromDate, toDate, totalamount, totalDays, token } = req.body;
    
    try {   
        // Sprawdzanie, czy dane tokena są poprawne
        if (!token || !token.email || !token.id) {
            return res.status(400).json({ message: "Nieprawidłowe dane tokena" });
        }

        // Tworzenie klienta w Stripe na podstawie danych z tokena
        const customer = await stripe.customers.create({
            email: token.email,
            source: token.id
        });

        // Próba dokonania płatności za pomocą Stripe
        const payment = await stripe.charges.create({
            amount: totalamount * 100,
            customer: customer.id,
            currency: 'PLN',
            receipt_email: token.email
        }, {
            idempotencyKey: uuidv4()
        });

        // Sprawdzanie statusu płatności
        if (payment) {
            try {
                // Logika rezerwacji pokoju
                console.log("Otrzymano żądanie rezerwacji:", req.body);

                const newBooking = new Booking({
                    room: {
                        _id: new mongoose.Types.ObjectId(room._id),
                        name: room.name,
                    },
                    userid,
                    fromDate,
                    toDate,
                    totalamount,
                    totalDays,
                    transactionid: payment.id,
                    status: "booked",
                });

                const booking = await newBooking.save();

                const roomtmp = await Room.findOne({ _id: room._id }).exec();

                roomtmp.currentbookings.push({
                    bookingid: booking._id,
                    fromdate: fromDate,
                    todate: toDate,
                    userid,
                    status: booking.status,
                });

                await roomtmp.save();
                console.log("Received data on the server:", req.body);
                // Odpowiedź w przypadku udanej rezerwacji
                res.status(200).json({ message: "Rezerwacja zakończona sukcesem", booking });
            } catch (error) {
                // Obsługa błędów podczas rezerwacji
                console.error("Błąd podczas rezerwacji:", error);
                console.error("Szczegóły błędu:", error.stack);

                if (error.name === 'ValidationError') {
                    res.status(400).json({ message: "Błąd walidacji", errors: error.errors });
                } else {
                    res.status(500).json({ message: "Wewnętrzny błąd serwera" });
                }
            }
        } else {
            // Odpowiedź w przypadku nieudanej płatności
            
            res.status(500).json({ message: "Płatność nieudana" });
        }
    } catch (error) {
        // Obsługa błędów
        console.error("Błąd podczas przetwarzania żądania:", error);
        
        if (error instanceof stripe.errors.StripeError) {
            // Obsługa błędów Stripe
            res.status(error.statusCode || 500).json({ message: error.message });
        } else if (error.name === 'ValidationError') {
            // Obsługa błędów walidacji
            res.status(400).json({ message: "Błąd walidacji", errors: error.errors });
        } else {
            // Obsługa innych błędów
            res.status(500).json({ message: "Wewnętrzny błąd serwera" });
        }
    }
});

module.exports = router;
