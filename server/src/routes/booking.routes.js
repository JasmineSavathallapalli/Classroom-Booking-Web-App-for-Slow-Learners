const express=require('express')
const { getBookings, createBooking, cancelBooking, getBookingBySessionId, getBookingByStudentId } = require('../controllers/booking.controller')
const { validateCreateBooking, validateCancelBooking } = require('../middlewares/validationMiddleware')


const router = express.Router()

router.get("/", getBookings)

router.get("/session/:sessionId", getBookingBySessionId)

router.get("/student/:studentId", getBookingByStudentId)

router.post("/create", validateCreateBooking, createBooking)

router.post("/cancel", validateCancelBooking, cancelBooking)

module.exports = router