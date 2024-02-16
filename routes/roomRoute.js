const express = require("express");
const router = express.Router();

// Import modelu pokoju
const Room = require('../models/room');

// Endpoint do pobierania wszystkich pokoi
router.get('/getallrooms', async (req, res) => {
  try {
    // Pobranie wszystkich pokoi z bazy danych
    const rooms = await Room.find({}).exec();

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
    const room = await Room.findOne({ _id: roomid }).exec();

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    res.send(room);
  } catch (error) {
    return handleErrorResponse(res, error);
  }
});



// Funkcja obsługująca błędy, używana w przypadku wystąpienia błędu w endpointach
function handleErrorResponse(res, error) {
  console.error("Error:", error);
  
  // Wysłanie odpowiedzi z błędem do klienta
  res.status(500).json({ message: "Internal Server Error" });
}


router.post("/addrooms", async(req, res)=>{

  try {
    const newroom = new Room(req.body)
    await newroom.save()

    res.send("Nowy pokój został dodany!")
  } catch (error) {
    return res.status(400).json({error})
  }

})

// Eksportuje router do użycia w innych częściach aplikacji
module.exports = router;