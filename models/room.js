const mongoose = require("mongoose");

const roomSchema =  mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    maxcount: {
        type: Number,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    renpertday: {
        type: Number,
        required: true
    },
    imageurl: {
        type: [], 
        required: true
    },
    currentbookings: {
        type: [], 
        required: true
    },
    type: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
}, {
    timestamps: true,
    collection: 'pokoiki'
});

const Room = mongoose.model('Room', roomSchema);

module.exports = Room;
