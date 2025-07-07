import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Chat from "../../components/Chat";
import Navbar from "../../components/NavBar";

export default function SelectTeacherChat() {
  const [student, setStudent] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [chatStates, setChatStates] = useState({});
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get logged-in student
  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:5000/auth/verify", { withCredentials: true })
      .then((res) => setStudent(res.data.user))
      .catch((err) => {
        console.error("User not authenticated:", err);
        setError("Failed to authenticate user");
      })
      .finally(() => setLoading(false));
  }, []);

  // Fetch teachers from student's sessions
  useEffect(() => {
    if (!student) return;

    setLoading(true);
    axios
      .get(`http://localhost:5000/api/bookings/student/${student._id}`, {
        withCredentials: true,
      })
      .then(async (res) => {
        const sessionData = res.data.sessions || res.data;
        setSessions(sessionData);

        const teacherIds = [
          ...new Set(
            sessionData
              .map((booking) => booking.sessionId?.teacherId)
              .filter(Boolean)
          ),
        ];

        const userRes = await axios.get("http://localhost:5000/api/users", {
          withCredentials: true,
        });

        const teacherDetails = userRes.data.filter(
          (user) => user.role === "teacher" && teacherIds.includes(user._id)
        );
        setTeachers(teacherDetails);

        for (const teacher of teacherDetails) {
          try {
            const chatRes = await axios.get(
              `http://localhost:5000/api/chat/conversation/${student._id}/${teacher._id}`,
              { withCredentials: true }
            );
            setChatStates((prev) => ({
              ...prev,
              [teacher._id]: chatRes.data.length > 0,
            }));
          } catch {
            setChatStates((prev) => ({
              ...prev,
              [teacher._id]: false,
            }));
          }
        }
      })
      .catch((err) => {
        console.error("Failed to load bookings or teachers:", err);
        setError("Failed to load teacher data");
      })
      .finally(() => setLoading(false));
  }, [student]);

  if (error) {
    return <div className="p-6 text-red-500 text-center">{error}</div>;
  }

  return (
    <div
      className="relative min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/images/background1.png')" }}
    >
      <Navbar role={"student"} />
      <div className="relative z-10 max-w-6xl mx-auto py-12 px-6">
        <div className="flex gap-4 bg-white bg-opacity-90 rounded-xl shadow-lg p-6">
          <div className="w-1/3 space-y-2">
            {teachers.map((teacher) => (
              <button
                key={teacher._id}
                className={`w-full text-left px-4 py-3 rounded-lg border transition-all duration-200 ${
                  selectedTeacher?._id === teacher._id
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
                onClick={() => setSelectedTeacher(teacher)}
              >
                {teacher.name}
              </button>
            ))}
          </div>

          <div className="w-2/3">
            {selectedTeacher ? (
              <Chat senderId={student?._id} recipientId={selectedTeacher._id} />
            ) : (
              <div className="text-gray-600 text-center mt-10">
                Select a teacher to start chatting.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
