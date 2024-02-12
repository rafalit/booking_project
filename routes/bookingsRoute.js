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
    const { room, userid, fromDate, toDate, totalamount, totalDays, token } = req.body;

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
        room: {
          _id: new mongoose.Types.ObjectId(room._id),
          name: room.name,
        },
        userid,
        fromDate: moment.utc(fromDate, "DD-MM-YYYY").toDate(),
        toDate: moment.utc(toDate, "DD-MM-YYYY").toDate(),
        totalamount,
        totalDays,
        transactionid: payment.id,
        status: "booked",
      });

      const booking = await newBooking.save();

      const roomtmp = await Room.findOne({ _id: room._id }).exec();

      roomtmp.currentbookings.push({
        bookingid: booking._id,
        fromDate: moment.utc(fromDate, "DD-MM-YYYY").format("DD-MM-YYYY"),
        toDate: moment.utc(toDate, "DD-MM-YYYY").format("DD-MM-YYYY"),
        userid: userid,
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


module.exports = router;
