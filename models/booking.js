const mongoose = require("mongoose");

const bookingSchema = mongoose.Schema({
    room: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room',
        required: true
    },
    userid: {
        type: String,
        required: true
    },
    fromDate: {
        type: String,
        required: true
    },
    toDate: {
        type: String,
        required: true
    },
    totalamount: {
        type: Number,
        required: true
    },
    totaldays: {
        type: Number,
        required: true
    },
    transactionid: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        default: "booked"
    }
}, {
    timestamps: true
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
