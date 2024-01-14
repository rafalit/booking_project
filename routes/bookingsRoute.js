const express = require("express");
const router = express.Router();
const Booking = require('../models/booking');

router.post("/bookroom", async (req, res) => {
    try {
        const { room, userid, fromDate, toDate, totalamount, totalDays } = req.body;

        console.log("Received booking request:", req.body);

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
            transactionId: "1234",
        });

        const booking = await newBooking.save();

        res.status(200).json({ message: "Room booked successfully", booking });
    } catch (error) {
        console.error("Error while booking room:", error);

        if (error.name === 'ValidationError') {
            res.status(400).json({ message: "Validation failed", errors: error.errors });
        } else {
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
});

module.exports = router;
