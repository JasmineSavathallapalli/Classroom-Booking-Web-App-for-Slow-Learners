import { useEffect, useState } from "react";
import axios from "axios";
import Chat from "../../components/Chat";
import Navbar from "../../components/NavBar";

export default function SelectStudentChat() {
  const [teacher, setTeacher] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Get teacher info on mount
  useEffect(() => {
    axios
      .get("http://localhost:5000/auth/verify", { withCredentials: true })
      .then((res) => setTeacher(res.data.user))
      .catch((err) => console.error("Error verifying teacher:", err));
  }, []);

  // Get sessions owned by teacher
  useEffect(() => {
    if (!teacher?._id) return;

    axios
      .get("http://localhost:5000/api/sessions/list", {
        params: { teacherId: teacher._id },
        withCredentials: true,
      })
      .then((res) => setSessions(res.data.sessions))
      .catch((err) => console.error("Error fetching sessions:", err));
  }, [teacher]);

  // Fetch all bookings for the teacher's sessions
  useEffect(() => {
    if (sessions.length === 0) return;

    const fetchAllBookings = async () => {
      try {
        const all = await Promise.all(
          sessions.map((session) =>
            axios.get(
              `http://localhost:5000/api/bookings/session/${session._id}`,
              {
                withCredentials: true,
              }
            )
          )
        );

        const bookings = all.flatMap((res) => res.data);
        setBookings(bookings);
      } catch (err) {
        console.error("Error fetching bookings:", err);
      }
    };

    fetchAllBookings();
  }, [sessions]);

  // Get unique students
  const uniqueStudents = Array.from(
    new Map(bookings.map((b) => [b.studentId._id, b.studentId])).values()
  );

  return (
    <div
      className="relative min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/images/background1.png')" }}
    >
      <Navbar role={"teacher"} />
      <div className="relative z-10 max-w-6xl mx-auto py-12 px-6">
        <div className="bg-white bg-opacity-90 backdrop-blur-md rounded-xl shadow-lg p-6 flex gap-6">
          {/* Student List */}
          <div className="w-1/3 space-y-3">
            {uniqueStudents.map((student) => (
              <button
                key={student._id}
                className={`w-full text-left px-4 py-3 rounded-lg border transition-all duration-200 ${
                  selectedStudent?._id === student._id
                    ? "bg-blue-600 text-white font-semibold"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
                onClick={() => setSelectedStudent(student)}
              >
                {student.name}
              </button>
            ))}
          </div>

          {/* Chat Area */}
          <div className="w-2/3 bg-white rounded-lg p-4 shadow-md min-h-[300px]">
            {selectedStudent ? (
              <Chat senderId={teacher._id} recipientId={selectedStudent._id} />
            ) : (
              <p className="text-gray-600 text-center mt-20">
                Select a student to start chatting.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
