const Booking=require('../models/booking.model');
const Session=require('../models/session.model');

exports.getBookings = async(req,res) => {
    try {
        const bookings = await Booking.find().populate('sessionId').populate('studentId');
        res.json(bookings);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
}

exports.getBookingBySessionId =  async(req,res)=>{
    try {
        const booking = await Booking.find({sessionId:req.params.sessionId}).populate('sessionId').populate('studentId')
        res.json(booking);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
}

exports.getBookingByStudentId =  async(req,res)=>{
    try {
        const booking = await Booking.find({studentId:req.params.studentId}).populate('sessionId').populate('studentId')
        res.json(booking);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
}

exports.createBooking = async (req,res) =>{
    try {
        const {sessionId} = req.body;
        const session = await Session.findById(sessionId);
        
        if(!session){
            return res.status(404).json({ message: "Session not found" });
        }
        if(session.bookedSeats==session.maxSeats){
            return res.status(404).json({ message: "Session is full" });
        }
        const existingBooking = await Booking.findOne({
            sessionId: req.body.sessionId,
            studentId: req.body.studentId,
            status: 'booked'
        });
        if (existingBooking) {
            return res.status(400).json({ message: "Student has already booked this session" });
        }
        
        else{
            const booking = new Booking(req.body);
            await booking.save();
            session.bookedSeats += 1;
            await session.save();
            res.status(201).json({success: true, data: booking, message: "Booking successful"});
        }  
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
}

exports.cancelBooking = async (req,res) =>{
    try {
        const bookingId = req.params.id;
        const booking = await Booking.findById(bookingId);
   
        if(!booking){
            return res.status(404).json({ message: "Booking not found" });
        }
        if(booking.status=='canceled'){
            return res.status(404).json({ message: "Booking is already canceled" });
        }
        const session = await Session.findByIdAndUpdate(booking.sessionId,{$inc:{bookedSeats:-1}});
        if(!session){
            return res.status(404).json({ message: "Session not found" });
        }

        booking.status='canceled';
        await booking.save();
        res.json(booking);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
}
