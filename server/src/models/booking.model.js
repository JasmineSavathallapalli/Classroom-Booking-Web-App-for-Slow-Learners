const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
    sessionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Session',  
        required: true
    },
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',  
        required: true
    },
    status: {
        type: String,
        enum: ['booked', 'canceled'],  
        default: 'booked'
    },
    bookingDate: {
        type: Date,
        default: Date.now  
    }
});

module.exports = mongoose.model('Booking', BookingSchema);
