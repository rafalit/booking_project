const  mongoose = require("mongoose")

var mongoURL = 'mongodb+srv://jasonsmith11:4321@cluster0.usijhja.mongodb.net/rooms'

//mongoose.connect(mongoURL, {useNewUrlParser: true, useUnifiedTopology: true})
mongoose.connect(mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  
 //  useCreateIndex: true, // Set to true to use createIndex() instead of ensureIndex()
  });
  
const connection = mongoose.connection

connection.on('error', () => {
    console.log('MongoDB connection failed')
})

connection.on('connected', () => {
    console.log('MongoDB connection successful')
})

module.exports = mongoose

