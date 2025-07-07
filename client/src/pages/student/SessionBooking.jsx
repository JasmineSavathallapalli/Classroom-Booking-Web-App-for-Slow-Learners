import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Navbar from "../../components/NavBar";

export default function SessionBooking() {
  const [user, setUser] = useState({});
  const [programmeSessions, setProgrammeSessions] = useState([]);
  const [filteredSessions, setFilteredSessions] = useState([]);
  const [searchTeacher, setSearchTeacher] = useState("");
  const [searchSubject, setSearchSubject] = useState("");
  const [bookingStatus, setBookingStatus] = useState({});

  useEffect(() => {
    axios
      .get("http://localhost:5000/auth/verify", { withCredentials: true })
      .then((response) => {
        const user = response.data.user;
        setUser(user);
        axios
          .get("http://localhost:5000/api/sessions/programme", {
            withCredentials: true,
            params: { name: user.programme },
          })
          .then((response) => {
            setProgrammeSessions(response.data.sessions);
            setFilteredSessions(response.data.sessions);
          })
          .catch((error) => console.log(error));
      })
      .catch(() => console.log("User not authenticated"));
  }, []);

  const handleSearch = () => {
    let filtered = programmeSessions;
    if (searchTeacher.trim()) {
      filtered = filtered.filter((session) =>
        session.teacher.name.toLowerCase().includes(searchTeacher.toLowerCase())
      );
    }
    if (searchSubject.trim()) {
      filtered = filtered.filter((session) =>
        session.sessionName.toLowerCase().includes(searchSubject.toLowerCase())
      );
    }
    setFilteredSessions(filtered);
  };

  const handleBook = (sessionId) => {
    const postReq = {
      sessionId: sessionId,
      studentId: user._id,
    };

    axios
      .post("http://localhost:5000/api/bookings/create", postReq, {
        withCredentials: true,
      })
      .then((response) => {
        setBookingStatus((prev) => ({
          ...prev,
          [sessionId]: { success: true, message: "Booking successful!" },
        }));
      })
      .catch((error) => {
        const errorMsg =
          error.response?.data?.message || "Booking failed. Try again.";
        setBookingStatus((prev) => ({
          ...prev,
          [sessionId]: { success: false, message: errorMsg },
        }));
      });
  };

  return (
    <>
      <Navbar role={"student"} />
      <div className="bg-[url('/images/background1.png')] bg-cover bg-center min-h-screen flex items-center justify-center p-6">
        <div className="bg-white w-full max-w-5xl p-8 rounded-xl shadow-xl">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            <i className="fas fa-search text-blue-600 mr-2"></i> Search for
            Sessions
          </h1>

          {/* Search Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative w-full md:w-1/2">
              <i className="fas fa-book-open absolute left-3 top-3 text-gray-400"></i>
              <input
                type="text"
                placeholder="Search by Subject Name"
                value={searchSubject}
                onChange={(e) => setSearchSubject(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded w-full focus:ring-2 focus:ring-blue-300"
              />
            </div>
            <button
              onClick={handleSearch}
              className="px-5 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition shadow"
            >
              <i className="fas fa-search mr-2"></i>Search
            </button>
          </div>

          {/* Session Cards */}
          <div className="grid gap-5">
            {filteredSessions.map((session) => (
              <div
                key={session._id}
                className="border p-6 rounded-lg shadow bg-white hover:shadow-lg transition"
              >
                {bookingStatus[session._id] && (
                  <p
                    className={`mb-2 text-sm font-medium ${
                      bookingStatus[session._id].success
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    <i
                      className={`fas ${
                        bookingStatus[session._id].success
                          ? "fa-check"
                          : "fa-times"
                      } mr-2`}
                    ></i>
                    {bookingStatus[session._id].message}
                  </p>
                )}

                <h2 className="text-2xl font-semibold text-blue-700 mb-2">
                  <i className="fas fa-book mr-2"></i>
                  {session.subject}
                </h2>

                <ul className="text-gray-700 text-sm space-y-1">
                  <li>
                    <i className="fas fa-info-circle text-gray-500 mr-2"></i>
                    <strong>Session Name:</strong> {session.sessionName}
                  </li>
                  <li>
                    <i className="fas fa-door-open text-gray-500 mr-2"></i>
                    <strong>Classroom:</strong> {session.classroom}
                  </li>
                  <li>
                    <i className="fas fa-layer-group text-gray-500 mr-2"></i>
                    <strong>Type:</strong> {session.sessionType}
                  </li>
                  <li>
                    <i className="fas fa-clock text-gray-500 mr-2"></i>
                    <strong>Time:</strong> {session.timeSlot.startTime} -{" "}
                    {session.timeSlot.endTime}
                  </li>
                  <li>
                    <i className="fas fa-calendar-alt text-gray-500 mr-2"></i>
                    <strong>Dates:</strong> {session.dates.join(", ")}
                  </li>
                  <li>
                    <i className="fas fa-chair text-gray-500 mr-2"></i>
                    <strong>Available Seats:</strong>{" "}
                    {session.maxSeats - session.bookedSeats} /{" "}
                    {session.maxSeats}
                  </li>
                  <li>
                    <i className="fas fa-chalkboard-teacher text-gray-500 mr-2"></i>
                    <strong>Teacher:</strong> {session.teacherId?.name}
                  </li>
                </ul>

                <button
                  onClick={() => handleBook(session._id)}
                  className="mt-4 px-4 py-2 bg-green-600 text-white font-medium rounded hover:bg-green-700 transition shadow-sm"
                >
                  <i className="fas fa-check-circle mr-2"></i>Book
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
