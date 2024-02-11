const express = require("express");
const router = express.Router();
const Room = require('../models/room');
const Booking = require('../models/booking');
const moment = require("moment");

// Endpoint obsługujący rezerwację pokoju
router.post("/bookroom", async (req, res) => {
  try {
    // Dekonstruowanie danych przesłanych w żądaniu
    const { room, userid, fromDate, toDate, totalamount, totalDays, transactionid } = req.body;

    // Wyświetlenie informacji o przyjętym żądaniu rezerwacji
    console.log("Received booking request:", req.body);

    // Tworzenie nowego obiektu rezerwacji na podstawie przekazanych danych
    // Tworzenie nowego obiektu rezerwacji na podstawie przekazanych danych
// Tworzenie nowego obiektu rezerwacji na podstawie przekazanych danych
const newBooking = new Booking({
  room: {
    name: room.name,
    _id: room._id,
  },
  userid,
  fromDate: moment.utc(fromDate, "DD-MM-YYYY").toDate(),
  toDate: moment.utc(toDate, "DD-MM-YYYY").toDate(),
  totalamount,
  totalDays,
  transactionid,
});

// Zapis nowej rezerwacji do bazy danych
const booking = await newBooking.save();

// Poprawiona część dotycząca daty
const roomtemp = await Room.findOne({_id : room._id});

roomtemp.currentbookings.push({
  bookingid: booking._id,
  fromDate: moment.utc(fromDate, "DD-MM-YYYY").format("DD-MM-YYYY"),
  toDate: moment.utc(toDate, "DD-MM-YYYY").format("DD-MM-YYYY"),
  userid: userid,
  status: booking.status
});

await roomtemp.save();

// Wysłanie odpowiedzi z potwierdzeniem udanej rezerwacji
res.status(200).json({ message: "Room booked successfully", booking });


  } catch (error) {
    console.error("Error while booking room:", error);

    // Obsługa błędów podczas rezerwacji
    if (error.name === "ValidationError") {
      // Walidacja nie powiodła się - błąd klienta
      res.status(400).json({ message: "Validation failed", errors: error.errors });
    } else {
      // Inny błąd - błąd serwera
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
});


// Dodaj ten endpoint do istniejącego pliku routes/bookingsRoute.js
router.get("/allbookings", async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.status(200).json({ bookings });
  } catch (error) {
    console.error("Error fetching all bookings:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Eksportuje router do użycia w innych częściach aplikacji
module.exports = router;
