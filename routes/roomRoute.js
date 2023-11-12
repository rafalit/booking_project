const express = require("express");
const router = express.Router();

const Room = require('../models/room');

router.get('/getallrooms', async (req, res) => {
//    const data = await Room.find({});
//    res.send(data);
//}   );
//router.get('/', async (req, res) => {
//    res.send('Hello World!');
//}   );


 try {
   const rooms = await Room.find({}).exec();
   console.log("Fetched rooms:", rooms);
   res.send(rooms);
 } catch (error) {
   console.error("Error fetching rooms:", error);
   const errorMessage = error.message || "Internal Server Error";
   return res.status(500).json({ message: errorMessage });
 }
  

});

module.exports = router;
