import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./TeacherDashboard.css";
import Navbar from "../../components/NavBar";

export default function TeacherDashboard() {
  const [user, setUser] = useState(null);
  const [upcoming, setUpcoming] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/auth/verify", { withCredentials: true })
      .then((response) => {
        setUser(response.data.user);

        axios
          .get("http://localhost:5000/api/sessions/list", {
            params: { teacherId: response.data.user._id },
            withCredentials: true,
          })
          .then((response) => {
            const today = new Date();
            const upcomingSessions = response.data.sessions.reduce(
              (acc, session) => {
                const validDates = session.dates
                  .filter((date) => new Date(date) >= today)
                  .map((date) => ({
                    name: session.sessionName,
                    timeSlot: session.timeSlot,
                    date: date,
                  }));

                return [...acc, ...validDates];
              },
              []
            );

            const sortedSessions = upcomingSessions.sort(
              (a, b) => new Date(a.date) - new Date(b.date)
            );

            setUpcoming(
              sortedSessions.slice(
                0,
                sortedSessions.length < 3 ? sortedSessions.length : 3
              )
            );
          })
          .catch((error) => console.log(error));
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <>
      <Navbar role={"teacher"} />
      <div className="teacher-dashboard-container">
        {/* Welcome Section */}
        <div className="welcome-banner">
          {user && <h1 className="welcome-heading">Welcome, {user.name}!</h1>}
          <p className="hero-subtitle">
            Manage your sessions and materials effortlessly.
          </p>
        </div>

        {/* Dashboard Grid */}
        <div className="teacher-section">
          {/* Upcoming Sessions */}
          <div className="teacher-card">
            <h2>
              <i className="fa-solid fa-calendar-days"></i> Upcoming Sessions
            </h2>
            {upcoming.length > 0 ? (
              <div className="upcoming-session-list">
                {upcoming.map((val, idx) => {
                  const parts = val.name.split("-");
                  const subject = parts[0] + " " + parts[1].trim();
                  let type = parts[2];
                  type += parts[2].trim() == "Single" ? "" : "-Long";
                  const room = type == "Single" ? parts[5] : parts[6];
                  console.log(parts);
                  return (
                    <div key={idx} className="session-card-enhanced">
                      <div className="session-header">
                        <h3 className="session-title">
                          <i className="fas fa-chalkboard-teacher"></i>{" "}
                          {subject}
                        </h3>
                        <span className={`badge badge-${type.toLowerCase()}`}>
                          {type}
                        </span>
                      </div>
                      <div className="session-details">
                        <p>
                          <i className="fas fa-calendar-alt"></i> {val.date}
                        </p>
                        <p>
                          <i className="fas fa-clock"></i>{" "}
                          {val.timeSlot.startTime} - {val.timeSlot.endTime}
                        </p>
                        <p>
                          <i className="fas fa-door-open"></i> {room}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="card-content">
                <i className="fa-solid fa-xmark-circle"></i> No upcoming
                sessions
              </p>
            )}
          </div>

          {/* Actions Card */}
          <div className="teacher-card">
            <h2>
              <i className="fa-solid fa-toolbox"></i> Actions
            </h2>
            <div className="action-links">
              <Link to="/teacher/create-session" className="dashboard-link">
                <i className="fa-solid fa-plus-circle"></i> Create New Session
              </Link>
              <Link to="/teacher/view-sessions" className="dashboard-link">
                <i className="fa-solid fa-folder-open"></i> View Sessions
              </Link>
              <Link to="/teacher/profile" className="dashboard-link">
                <i className="fa-solid fa-pen-to-square"></i> Edit Profile
              </Link>
               <Link to="/teacher/chat" className="dashboard-link chat">
            <i className="fa-solid fa-folder-open"></i> View Chats
          </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
