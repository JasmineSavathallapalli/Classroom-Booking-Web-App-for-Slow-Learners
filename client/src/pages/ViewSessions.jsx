import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/NavBar";

export default function ViewSessions() {
  const [user, setUser] = useState(null);
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/auth/verify", { withCredentials: true })
      .then((response) => setUser(response.data.user))
      .catch(() => console.log("User not authenticated"));
  }, []);

  useEffect(() => {
    if (user) {
      if (user.role === "teacher") {
        axios
          .get("http://localhost:5000/api/sessions/list", {
            params: { teacherId: user._id },
            withCredentials: true,
          })
          .then((response) => setSessions(response.data.sessions))
          .catch((error) =>
            console.log("User not authenticated: " + error.message)
          );
      }
      if (user.role === "student") {
        axios
          .get(`http://localhost:5000/api/sessions/list/${user._id}`, {
            withCredentials: true,
          })
          .then((response) => {
            const bookings = response.data.sessions;
            const sessionDetails = bookings.map((booking) => booking.sessionId);
            setSessions(sessionDetails);
          })
          .catch((error) =>
            console.log("Error fetching student sessions: " + error.message)
          );
      }
    }
  }, [user]);

  // Updated function to extract session details from session name
  const extractSessionDetails = (sessionName) => {
    const parts = sessionName.split("-");
    const subject = parts[1].trim();
    let type = parts[2];
    type += parts[2].trim() === "Single" ? "" : "-Long"; // Append '-Long' for multi-day sessions
    const room = type === "Single" ? parts[5] : parts[6]; // Select room based on session type

    return {
      subject,
      sessionType: type,
      classroom: room,
    };
  };

  // Function to display session type with icon/label
  const getSessionTypeLabel = (type) => {
    switch (type) {
      case "Single":
        return (
          <span className="px-2 py-1 text-xs font-semibold text-white bg-blue-500 rounded-full">
            Single
          </span>
        );
      case "Week-Long":
        return (
          <span className="px-2 py-1 text-xs font-semibold text-white bg-green-500 rounded-full">
            Week-Long
          </span>
        );
      case "Semester-Long":
        return (
          <span className="px-2 py-1 text-xs font-semibold text-white bg-orange-500 rounded-full">
            Semester-Long
          </span>
        );
      case "Custom":
        return (
          <span className="px-2 py-1 text-xs font-semibold text-white bg-purple-500 rounded-full">
            Custom
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 text-xs font-semibold text-white bg-gray-500 rounded-full">
            Unknown
          </span>
        );
    }
  };

  return (
    <>
      {user && <Navbar role={user.role} />}
      <div className="bg-[url('/images/background.png')] bg-cover bg-center min-h-screen flex items-center justify-center p-6">
        <div className="bg-white w-full max-w-5xl p-8 rounded-xl shadow-xl">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            <i className="fas fa-chalkboard-teacher text-gray-600"></i> Your
            Sessions
          </h1>

          {sessions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sessions.map((session) => {
                console.log(session);
                const sessionDetails = extractSessionDetails(
                  session.sessionName
                );
                return (
                  <Link
                    key={session._id}
                    to={`/${user.role}/view-session/${session._id}`}
                    className="block p-6 border border-gray-300 bg-white text-gray-800 text-lg font-medium rounded-lg shadow-sm hover:shadow-lg hover:bg-gray-50 transition-all"
                  >
                    <div className="flex flex-col">
                      <div className="flex justify-between items-center">
                        <span className="text-xl font-semibold">
                          {sessionDetails?.subject || "Session"}
                        </span>
                        <span className="text-sm text-gray-500">
                          <i className="fas fa-clock text-gray-600"></i>{" "}
                          {session?.timeSlot.startTime} -{" "}
                          {session?.timeSlot.endTime}
                        </span>
                      </div>
                      <div className="mt-2 space-y-1">
                        <p className="text-sm text-gray-600">
                          <strong>Session Type:</strong>{" "}
                          {getSessionTypeLabel(sessionDetails?.sessionType)}
                        </p>
                        <p className="text-sm text-gray-600">
                          <strong>Classroom:</strong>{" "}
                          {sessionDetails?.classroom}
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500 text-center">
              <i className="fas fa-exclamation-circle text-gray-600"></i> No
              sessions found.
            </p>
          )}
        </div>
      </div>
    </>
  );
}
