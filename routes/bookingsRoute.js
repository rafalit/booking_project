const express = require("express");
const router = express.Router();
const Room = require('../models/room');
const Booking = require('../models/booking');
const moment = require("moment");
const stripe = require('stripe')('sk_test_51OYurRJuf3K9tPXcgKmaOKbrLYHbAkLrdLJNDWstwjFMF0p1M97MsBaiXrZZElVHyzsaI7Dges32QvAGIuVSXcPf00kA0NamgN')
const { v4: uuidv4 } = require('uuid');
const mongoose = require('mongoose');  // Add this line

// Endpoint obsługujący rezerwację pokoju
router.post("/bookroom", async (req, res) => {
  try {
    const { room, username, fromDate, toDate, totalamount, totalDays, token } = req.body;

    if (!token || !token.email || !token.id) {
      return res.status(400).json({ message: "Invalid token data" });
    }

    console.log("Received data on the server:", req.body);

    const customer = await stripe.customers.create({
      email: token.email,
      source: token.id,
    });

    const payment = await stripe.charges.create(
      {
        amount: totalamount * 100,
        customer: customer.id,
        currency: "PLN",
        receipt_email: token.email,
      },
      {
        idempotencyKey: uuidv4(),
      }
    );

    if (payment) {
      const newBooking = new Booking({
        name: room.name,
        roomid: room._id,
        username,
        fromDate: moment.utc(fromDate, "DD-MM-YYYY").format("DD-MM-YYYY"),
        toDate: moment.utc(toDate, "DD-MM-YYYY").format("DD-MM-YYYY"),
        totalDays,
        totalamount,
        transactionid: payment.id,
        status: "booked",
    });

      const booking = await newBooking.save();

      const roomtmp = await Room.findOne({ _id: room._id }).exec();

      roomtmp.currentbookings.push({
        bookingid: booking._id,
        fromDate: moment.utc(fromDate, "DD-MM-YYYY").format("DD-MM-YYYY"),
        toDate: moment.utc(toDate, "DD-MM-YYYY").format("DD-MM-YYYY"),
        username,
        status: booking.status,
      });

      await roomtmp.save();

      console.log("Booking successful. Transaction ID:", payment.id);
      res.status(200).json({ message: "Booking successful", booking });
    } else {
      console.error("Payment failed");
      res.status(500).json({ message: "Payment failed" });
    }
  } catch (error) {
    console.error("Error during booking:", error);
    res.status(500).json({ message: "Error during booking", error });
  }
});


router.post("/getbookingsbyuserid", async (req, res) => {
  const username = req.body.username;

  try {
    const bookings = await Booking.find({ username: username, status: { $ne: 'Anulowane' } }); // Change from userid to username
    res.send(bookings);
  } catch (error) {
    return res.status(400).json({ error });
  }
});

router.post("/cancelbooking", async (req, res) => {
  const { bookingid } = req.body;
  try {
    const bookingitem = await Booking.findOne({ _id: bookingid });

    if (!bookingitem) {
      return res.status(404).json({ error: "Booking not found" });
    }

    // Update only the status field
    bookingitem.status = 'cancelled';

    await bookingitem.save();

    const rooms = await Room.findOne({ _id: bookingitem.roomid });

    if (!rooms) {
      return res.status(404).json({ error: "Room not found" });
    }

    // Remove the canceled booking from currentbookings
    rooms.currentbookings = rooms.currentbookings.filter(booking => booking.bookingid.toString() !== bookingid.toString());

    await rooms.save();

    res.send("Zamówienie zostało anulowane!");
  } catch (error) {
    console.error("Error during cancellation:", error);
    res.status(500).json({ error: "An error occurred during cancellation." });
  }
});

router.get("/getallbookings", async(req, res) => {
    try {
        const bookings = await Booking.find()
        res.send(bookings)
    } catch (error) {
      return res.status(400).json({error})
    }
})


module.exports = router;