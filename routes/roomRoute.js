const express = require("express");
const router = express.Router();

const Room = require('../models/room');

router.get('/getallrooms', async (req, res) => {
  try {
      const rooms = await Room.find({}).exec();
      console.log("Fetched rooms:", rooms);
      res.send(rooms);
  } catch (error) {
      return handleErrorResponse(res, error);
  }
});

router.post('/getroombyid', async (req, res) => {
  const { roomid } = req.body;

  try {
      const room = await Room.findOne({ _id: roomid }).exec();
      console.log("Fetched room:", room);
      
      if (!room) {
          return res.status(404).json({ message: "Room not found" });
      }

      res.send(room);
  } catch (error) {
      return handleErrorResponse(res, error);
  }
});


module.exports = router;
