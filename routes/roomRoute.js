const express = require("express");
const router = express.Router();

// Import modelu pokoju
const Room = require('../models/room');

// Endpoint do pobierania wszystkich pokoi
router.get('/getallrooms', async (req, res) => {
  try {
    // Pobranie wszystkich pokoi z bazy danych
    const rooms = await Room.find({}).exec();
    
    // Wyświetlenie pobranych pokoi na konsoli
    console.log("Fetched rooms:", rooms);

    // Wysłanie pobranych pokoi jako odpowiedź
    res.send(rooms);
  } catch (error) {
    // Obsługa błędów poprzez wywołanie funkcji handleErrorResponse
    return handleErrorResponse(res, error);
  }
});

// Endpoint do pobierania pokoju na podstawie ID
router.post('/getroombyid', async (req, res) => {
  const { roomid } = req.body;

  try {
    // Pobranie pokoju z bazy danych na podstawie ID
    const room = await Room.findOne({ _id: roomid }).exec();
    
    // Wyświetlenie pobranego pokoju na konsoli
    console.log("Fetched room:", room);

    // Sprawdzenie, czy pokój został znaleziony
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    // Wysłanie pobranego pokoju jako odpowiedź
    res.send(room);
  } catch (error) {
    // Obsługa błędów poprzez wywołanie funkcji handleErrorResponse
    return handleErrorResponse(res, error);
  }
});

// Eksportuje router do użycia w innych częściach aplikacji
module.exports = router;

// Funkcja obsługująca błędy, używana w przypadku wystąpienia błędu w endpointach
function handleErrorResponse(res, error) {
  console.error("Error:", error);
  
  // Wysłanie odpowiedzi z błędem do klienta
  res.status(500).json({ message: "Internal Server Error" });
}
