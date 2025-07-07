const express = require("express");
const router = express.Router();
const attendanceController = require("../controllers/attendance.controller");

router.post("/", attendanceController.markAttendance);

router.get("/", attendanceController.getAllAttendance);

router.delete("/delete/:studentId/:sessionId", attendanceController.deleteAttendance);

router.get("/session/:sessionId", attendanceController.getSessionAttendance);

router.get("/session/:sessionId/student/:studentId", attendanceController.getStudentAttendance);

module.exports = router;
