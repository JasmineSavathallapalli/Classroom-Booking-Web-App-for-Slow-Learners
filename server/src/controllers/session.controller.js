const Session = require('../models/session.model')
const Booking = require('../models/booking.model')


// Get all sessions of a specific teacher
exports.getSessions= async (req, res) => {
    try {
        const {teacherId} = req.query;
        if (!teacherId) {
            return res.status(400).json({ message: "teacherId is required" });
        }
        const sessions = await Session.find({teacherId: teacherId});
        res.status(201).json({sessions: sessions})
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
 }

 exports.getSessionsOfStudent = async(req, res) => {
    try {
        const {studentId} = req.params;
        if(!studentId)
            return res.status(400).json({message: "studentId is required"});
        const sessions = await Booking.find({studentId : studentId}).populate("sessionId");
        res.status(201).json({sessions: sessions})
    } catch (error) {
        res.status(500).json({message: error.message})
    }
 }


// Get details about a specific session
 exports.getSession = async (req,res)=>{
    try {
       
        
        const session = await Session.findById(req.params.sessionId)
        if (!session) {
            return res.status(404).json({ message: "Session not found" });
        }
        res.status(200).json({session: session})
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
 }

 // Get sessions by programme
 exports.getSessionsByProgramme = async (req, res) => {
    try {
        const { name } = req.query;
        if (!name) {
            return res.status(400).json({ message: "Programme name is required" });
        }


        // Correct query targeting 'programme' field, not '_id'
        const sessions = await Session.find({ programme: name }).populate("teacherId", "name");

        if (sessions.length === 0) {
            return res.status(404).json({ message: "No sessions found for this programme" });
        }

        res.status(200).json({ sessions });
    } catch (error) {
        console.error(error);  // Log the error for debugging purposes
        res.status(500).json({ message: error.message });
    }
};


exports.createSession = async (req, res)=>{
         try {
             const session = new Session(req.body);
             await session.save();
             res.status(201).json({sucess: true, data: session, message: "Session created successfully"});
         } catch (error) {
             res.status(500).json({ error: error.message });
         }
  }

exports.deleteSession = async (req, res)=>{
    try {
        const session = await Session.findByIdAndDelete(req.params.sessionId)
        if(!session){
            res.status(404).json({ message: "Session not found" })
        }
        res.status(201).json({success: true, data: session, message: "Session deleted successfully"})
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
 }

