import React from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Navbar.css";

export default function Navbar({ role }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/users/logout",
        {},
        { withCredentials: true }
      );
      navigate("/");
    } catch (error) {
      console.log("Logout failed:", error);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          EasyLearn
        </Link>
        <ul className="navbar-links">
          {role === null && (
            <>
              <li>
                <Link to="/" className="navbar-link">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/login" className="navbar-link">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/signup" className="navbar-link">
                  Sign Up
                </Link>
              </li>
            </>
          )}

          {role === "teacher" && (
            <>
              <li>
                <Link to="/teacher/dashboard" className="navbar-link">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/teacher/view-sessions" className="navbar-link">
                  View Sessions
                </Link>
              </li>
              <li>
                <Link to="/teacher/chat" className="navbar-link">
                View Chats
                </Link>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="navbar-link logout-btn"
                >
                  Logout
                </button>
              </li>
            </>
          )}

          {role === "student" && (
            <>
              <li>
                <Link to="/student/dashboard" className="navbar-link">
                  Student Dashboard
                </Link>
              </li>
              <li>
                <Link to="/student/view-sessions" className="navbar-link">
                  View Sessions
                </Link>
              </li>
              <li>
                <Link to="/student/chat" className="navbar-link">
                View Chats
                </Link>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="navbar-link logout-btn"
                >
                  Logout
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}
