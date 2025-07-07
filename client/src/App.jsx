import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import LoginPage from "./pages/Login";
import CreateSession from "./pages/teacher/CreateSession";
import TeacherProfile from "./pages/teacher/TeacherProfile";
import ViewSessions from "./pages/ViewSessions";
import ViewSingleSession from "./pages/ViewSingleSession";
import UploadMaterial from "./pages/teacher/UploadMaterial";
import SignupPage from "./pages/Signup";
import StudentDashboard from "./pages/student/StudentDashboard";
import SessionBooking from "./pages/student/SessionBooking";
import ViewMaterials from "./pages/student/ViewMaterials";
import TakeAttendance from "./pages/teacher/TakeAttendance";
import ViewAttendance from "./pages/student/ViewAttendance";
import ChatBox from "./pages/ChatBox";
import SelectTeacherChat from "./pages/student/SelectTeacherChat";
import SelectStudentChat from "./pages/teacher/SelectStudentChat";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
        <Route path="/teacher/create-session" element={<CreateSession />} />
        <Route path="/teacher/profile" element={<TeacherProfile />} />
        <Route path="/teacher/view-sessions" element={<ViewSessions />} />
        <Route
            path="/teacher/session/:sessionId/attendance/:date"
            element={<TakeAttendance />}
        />

        <Route
          path="/teacher/view-session/:id"
          element={<ViewSingleSession role="teacher"/>}
        />
        <Route
          path="/teacher/session/:id/upload-material/:date"
          element={<UploadMaterial />}
        />
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/student/book-session" element={<SessionBooking />} />
        <Route path="/student/view-sessions" element={<ViewSessions />} />
        <Route
          path="/student/view-session/:id"
          element={<ViewSingleSession role="student"/>}
        />
        <Route path="/student/session/:sessionId/view-materials/:date" element={<ViewMaterials />} />
        <Route path="/student/session/:sessionId/view-attendance/" element={<ViewAttendance />} />

        <Route path="/student/chat" element={<SelectTeacherChat />} />

        <Route path="/student/chat/:teacherId" element={<ChatBox />} />
        <Route path="/teacher/chat" element={<SelectStudentChat />} />
        <Route path="/teacher/chat/:studentId" element={<ChatBox />} />
      </Routes>
    </Router>
  );
}
