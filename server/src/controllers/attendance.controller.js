const Attendance = require("../models/attendance.model");

exports.markAttendance = async (req, res) => {
  try {
    const { student, session, status, markedBy, date } = req.body;

    const newAttendance = new Attendance({
      student,
      session,
      status,
      markedBy,
      date, 
    });

    await newAttendance.save();
    res.status(201).json({ message: "Attendance marked successfully", newAttendance });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};


exports.deleteAttendance = async (req, res) => {
  try {
    const { studentId, sessionId } = req.params;
    const { date } = req.query;

    const query = {
      student: studentId,
      session: sessionId,
    };

    if (date) {
      query.date = date;
    }

    const attendanceRecords = await Attendance.find(query);

    if (attendanceRecords.length === 0) {
      return res.status(200).json({ message: "No attendance records found for this student and session" });
    }

    const deletedAttendance = await Attendance.deleteMany(query);

    res.status(200).json({
      message: `Successfully deleted ${deletedAttendance.deletedCount} attendance record(s)`,
    });
  } catch (error) {
    console.error("Error deleting attendance:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};



exports.getAllAttendance =async (req,res)=>{
    try {
        const attendance = await Attendance.find().populate("student").populate("session");
        res.status(200).json({ attendance });
        } catch (error) {
            res.status(500).json({ message: "Server Error", error: error.message });
            }
}

exports.getSessionAttendance = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { date } = req.query;

    const query = { session: sessionId };
    if (date) query.date = date;

    const attendance = await Attendance.find(query).populate("student", "name registerNumber");

    res.status(200).json(attendance);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};



exports.getStudentAttendance = async (req, res) => {
  try {
    const { sessionId, studentId } = req.params;
    const attendance = await Attendance.find({ session: sessionId, student: studentId }).populate("session", "subject schedule");

    res.status(200).json(attendance);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
