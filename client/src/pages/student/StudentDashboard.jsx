import { Link, useNavigate } from "react-router-dom";
import "./StudentDashboard.css";
import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/NavBar";

export default function StudentDashboard() {
  const [user, setUser] = useState(null);
  const [upcoming, setUpcoming] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/auth/verify", { withCredentials: true })
      .then((response) => {
        setUser(response.data.user);

        axios
          .get(
            `http://localhost:5000/api/sessions/list/${response.data.user._id}`,
            {
              withCredentials: true,
            }
          )
          .then((response) => {
            const today = new Date();
            const upcomingSessions = response.data.sessions.reduce(
              (acc, session) => {
                session = session.sessionId;
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
      <Navbar role={"student"} />
      <div className="student-dashboard-container">
        {/* Full-width Hero Section */}
        <header className="hero">
          <div className="hero-content">
            <h1 className="welcome-heading">Welcome {user ? user.name.split(" ")[0] : ""}</h1>
            <p className="hero-subtitle">
              Organize, manage, and track your sessions effectively in one
              place.
            </p>
          </div>
        </header>
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
            <Link to="/student/book-session" className="dashboard-link create">
              <i className="fa-solid fa-folder-open"></i> Book Session
            </Link>
            <Link to="/student/view-sessions" className="dashboard-link view">
              <i className="fa-solid fa-folder-open"></i> View Sessions
            </Link>
            <Link to="/student/chat" className="dashboard-link chat">
            <i className="fa-solid fa-folder-open"></i> View Chats
          </Link>
          </div>
        </div>
      </div>
    </>
  );
}
