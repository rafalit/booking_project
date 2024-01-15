const express = require("express");
const router = express.Router();
const Room = require('../models/room');
const mongoose = require("mongoose"); // Dodaj tę linię, aby zaimportować mongoose
const Booking = require('../models/booking');

router.post("/bookroom", async (req, res) => {
    try {
        const { room, userid, fromDate, toDate, totalamount, totalDays } = req.body;

        console.log("Received booking request:", req.body);

        const newBooking = new Booking({
            room: {
                _id: new mongoose.Types.ObjectId(room._id), // Zmień 'mongoose' na 'mongoose.Types.ObjectId'
                name: room.name,
            },
            userid,
            fromDate,
            toDate,
            totalamount,
            totalDays,
            transactionid: "1234", // Zmień 'transactionId' na 'transactionid'
            status: "booked", // Dodaj status 'booked'
        });


        const booking = await newBooking.save();

        const roomtmp = await Room.findOne({ _id: room._id }).exec();

        roomtmp.currentbookings.push({ bookingid: booking._id,
             fromdate: fromDate, 
             todate: toDate,
                userid: userid,
                status: booking.status,
             }); // Dodaj poniższe linie, aby dodać id rezerwacji do listy rezerwacji pokoju
             await roomtmp.save();
        res.status(200).json({ message: "Booking booked successfully", booking });
    } catch (error) {
        console.error("Error during booking:", error);

        // Dodaj poniższe linie, aby zalogować dodatkowe informacje o błędzie
        console.error("Error details:", error.stack);

        if (error.name === 'ValidationError') {
            res.status(400).json({ message: "Validation error", errors: error.errors });
        } else {
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
});

module.exports = router;
