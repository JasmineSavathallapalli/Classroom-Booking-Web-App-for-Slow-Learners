import { useState, useEffect } from "react";
import axios from "axios";
import Button from "../../components/Button";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../components/NavBar";

export default function TakeAttendance() {
  const navigate = useNavigate();
  const { sessionId, date: sessionDate } = useParams(); // ✅ get date from params
  const [user, setUser] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [bookingList, setBookingList] = useState([]);
  const [statusMessage, setStatusMessage] = useState("");
  const [markedAttendance, setMarkedAttendance] = useState({});
  const [tempAttendance, setTempAttendance] = useState({});

  useEffect(() => {
    if (!sessionId || !sessionDate) return;
    axios
      .get(`http://localhost:5000/api/attendance/session/${sessionId}`, {
        params: { date: sessionDate },
        withCredentials: true,
      })
      .then((response) => {
        const statusMap = {};
        response.data.forEach((entry) => {
          statusMap[entry.student._id] = entry.status;
        });
        setMarkedAttendance(statusMap);
      })
      .catch(() => {});
  }, [sessionId, sessionDate]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/auth/verify", { withCredentials: true })
      .then((response) => {
        setUser(response.data.user);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!user || !user._id) return;
    axios
      .get("http://localhost:5000/api/sessions/list", {
        params: { teacherId: user._id },
        withCredentials: true,
      })
      .then((response) => {
        setSessions(response.data.sessions || response.data);
      })
      .catch(() => {});
  }, [user]);

  useEffect(() => {
    if (!sessionId) return;
    axios
      .get(`http://localhost:5000/api/bookings/session/${sessionId}`, {
        withCredentials: true,
      })
      .then((response) => {
        const sortedBookings = response.data.sort((a, b) => {
          const regA = a.studentId.registerNumber.slice(-4);
          const regB = b.studentId.registerNumber.slice(-4);
          return regA.localeCompare(regB, undefined, { numeric: true });
        });
        setBookingList(sortedBookings);
      })
      .catch(() => {});
  }, [sessionId]);

  const handleAttendance = (studentId, status) => {
    setTempAttendance((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

  const confirmAttendance = async () => {
    if (Object.keys(tempAttendance).length === 0) {
      alert("No attendance changes to confirm.");
      return;
    }

    try {
      for (const studentId of Object.keys(tempAttendance)) {
        await axios.delete(
          `http://localhost:5000/api/attendance/delete/${studentId}/${sessionId}`,
          {
            params: { date: sessionDate },
            withCredentials: true,
          }
        );
      }

      for (const [studentId, status] of Object.entries(tempAttendance)) {
        await axios.post(
          "http://localhost:5000/api/attendance/",
          {
            student: studentId,
            session: sessionId,
            date: sessionDate,
            status: status,
            markedBy: user._id,
          },
          { withCredentials: true }
        );
      }

      setStatusMessage("Attendance confirmed!");
      setTimeout(() => setStatusMessage(""), 2000);
      setMarkedAttendance(tempAttendance);
      setTempAttendance({});
      setTimeout(() => {
        navigate(`/teacher/view-session/${sessionId}`);
      }, 1000);
    } catch (error) {
      alert("Failed to confirm attendance. Error:", error);
    }
  };

  return (
    <>
      <Navbar role={"teacher"} />
      <div className="bg-[url('/images/background1.png')] bg-cover bg-center min-h-screen flex items-center justify-center p-6">
        <div className="max-w-5xl mx-auto bg-white p-6 rounded-lg shadow-lg">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-blue-700">
              <i className="fas fa-clipboard-list mr-2"></i>Attendance Portal
            </h1>
            {statusMessage && (
              <p className="mt-2 text-green-600 text-sm font-medium">
                {statusMessage}
              </p>
            )}
          </div>

          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">
              <i className="fas fa-user-graduate mr-2"></i>Student List
            </h2>
            <p className="text-sm text-gray-500">
              Click "Present" or "Absent" to mark attendance for each student.
            </p>
          </div>

          <div className="space-y-4">
            {bookingList.map((booking) => {
              const studentId = booking.studentId._id;
              const attendanceStatus =
                tempAttendance[studentId] || markedAttendance[studentId];
              const isPresent = attendanceStatus === "Present";
              const isAbsent = attendanceStatus === "Absent";

              return (
                <div
                  key={studentId}
                  className="flex items-center justify-between border rounded-lg p-4 bg-gray-50 shadow-sm hover:shadow-md transition"
                >
                  <div className="flex flex-col">
                    <h3 className="text-lg font-bold text-gray-800">
                      <i className="fas fa-user mr-2"></i>
                      {booking.studentId.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      <i className="fas fa-id-badge mr-1"></i>Reg No:{" "}
                      {booking.studentId.registerNumber}
                    </p>
                    {attendanceStatus && (
                      <span
                        className={`mt-1 text-xs font-semibold rounded px-2 py-1 inline-block ${
                          isPresent
                            ? "bg-green-100 text-green-700"
                            : isAbsent
                            ? "bg-red-100 text-red-600"
                            : ""
                        }`}
                      >
                        <i
                          className={`mr-1 ${
                            isPresent
                              ? "fas fa-check-circle"
                              : "fas fa-times-circle"
                          }`}
                        ></i>
                        Marked: {attendanceStatus}
                      </span>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAttendance(studentId, "Present")}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                        isPresent
                          ? "bg-green-500 text-white"
                          : "bg-green-100 text-green-700 hover:bg-green-200"
                      }`}
                    >
                      <i className="fas fa-check mr-1"></i> Present
                    </button>
                    <button
                      onClick={() => handleAttendance(studentId, "Absent")}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                        isAbsent
                          ? "bg-red-500 text-white"
                          : "bg-red-100 text-red-600 hover:bg-red-200"
                      }`}
                    >
                      <i className="fas fa-times mr-1"></i> Absent
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-8">
            <button
              onClick={confirmAttendance}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition"
            >
              <i className="fas fa-check-double mr-2"></i>Confirm Attendance
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
