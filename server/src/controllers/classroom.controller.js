const Classroom = require("../models/classroom.model");
const Session = require("../models/session.model");

exports.fetchAll = async (req, res) => {
  try {
    const classrooms = await Classroom.find();
    res.status(200).json({ classrooms: classrooms });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

exports.fetchAvailable = async (req, res) => {
  const { dates, startTime, endTime } = req.query;

  let [startHours, startMinutes] = startTime.split(":").map(Number);
  let [endHours, endMinutes] = endTime.split(":").map(Number);

  const incomingStartTime = new Date(1970, 0, 1, startHours, startMinutes);
  const incomingEndTime = new Date(1970, 0, 1, endHours, endMinutes);

  const isOverlapping = (timeSlot) => {
    try {
      let [sH, sM] = timeSlot.startTime.split(":").map(Number);
      let [eH, eM] = timeSlot.endTime.split(":").map(Number);

      let slotStart = new Date(1970, 0, 1, sH, sM);
      let slotEnd = new Date(1970, 0, 1, eH, eM);

      return incomingStartTime < slotEnd && incomingEndTime > slotStart;
    } catch (error) {
      console.error("Error in time comparison:", error);
      return true;
    }
  };

  try {
    if (!dates || !startTime || !endTime)
      return res.status(400).json({ message: "Missing required fields." });
    const sessionsOnSameDates = await Session.find(
      { dates: { $in: dates } },
      { classroom: 1, timeSlot: 1 }
    );

    const busyClassrooms = new Set();
    for (let session of sessionsOnSameDates) {
      if (isOverlapping(session.timeSlot)) {
        busyClassrooms.add(session.classroom);
      }
    }
    const allClassrooms = await Classroom.find();
    const availableClsrooms = allClassrooms.filter(
      (cls) => !busyClassrooms.has(cls.name)
    );

    return res.json({ availableClsrooms });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: err });
  }
};

exports.deleteClass = async (req, res) => {
  try {
    const deletedClassroom = await Classroom.findByIdAndDelete(req.params.id);
    if (!deletedClassroom) {
      return res.status(404).json({ message: "Classroom not found" });
    }
    res.status(200).json({ message: "Classroom deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
