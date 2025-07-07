import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./SessionCalender.css";
import { Button } from "../components";
import TakeAttendance from "./teacher/TakeAttendance";
import Navbar from "../components/NavBar";

export default function ViewSingleSession({ role }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const [session, setSession] = useState(null);
  const [date, setDate] = useState(0);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/sessions/${id}`, {
        withCredentials: true,
      })
      .then((response) => setSession(response.data.session))
      .catch(() => console.log("Error fetching session details"));
  }, [id]);

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-xl text-gray-500">Loading session details...</div>
      </div>
    );
  }

  const markedDates = session.dates.map((date) => new Date(date));

  const tileContent = ({ date, view }) => {
    if (view === "month") {
      const isMarked = markedDates.some(
        (markedDate) =>
          date.getFullYear() === markedDate.getFullYear() &&
          date.getMonth() === markedDate.getMonth() &&
          date.getDate() === markedDate.getDate()
      );

      return isMarked ? <div className="highlight"></div> : null;
    }
  };

  const handleDayClick = (clickedDate) => {
    console.log(session.dates);
    // The clickedDate is off by 1 date, so we need to manually increasing the day by 1
    const clickedDateStr = new Date(
      clickedDate.getFullYear(),
      clickedDate.getMonth(),
      clickedDate.getDate() + 1
    )
      .toISOString()
      .split("T")[0];
    if (session.dates.includes(clickedDateStr)) setDate(clickedDateStr);
  };

  const handleClick = (e) => {
    if (e.target.name === "upload-materials")
      navigate(`/teacher/session/${session._id}/upload-material/${date}`);
    if (e.target.name === "mark-attendance")
      navigate(`/teacher/session/${session._id}/attendance/${date}`);
  };

  return (
    <>
      {<Navbar role={role} />}

      <div className="bg-[url('/images/background1.png')] bg-cover bg-center min-h-screen flex items-center justify-center p-6">
        <div className="bg-white w-full max-w-3xl p-8 rounded-lg shadow-xl space-y-8">
          <h1 className="text-4xl font-extrabold text-gray-800 text-center mb-6">
            {session.subject || "Session Details"}
          </h1>

          <div className="space-y-4 text-gray-700">
            <div className="flex items-center gap-2">
              <i className="fas fa-clock text-black"></i>{" "}
              <strong>Time Slot:</strong> {session.timeSlot.startTime} -{" "}
              {session.timeSlot.endTime}
            </div>
            <div className="flex items-center gap-2">
              <i className="fas fa-chalkboard-teacher text-black"></i>{" "}
              <strong>Classroom:</strong> {session.classroom || "Not specified"}
            </div>
            <div className="flex items-center gap-2">
              <i className="fas fa-chair text-black"></i>{" "}
              <strong>Maximum Seats:</strong>{" "}
              {session.maxSeats || "Not specified"}
            </div>
            <div className="flex items-center gap-2">
              <i className="fas fa-chair text-black"></i>{" "}
              <strong>Booked Seats:</strong>{" "}
              {session.bookedSeats || 0}
            </div>
            <div className="flex items-center gap-2">
              <i className="fas fa-chair text-black"></i>{" "}
              <strong>Available Seats:</strong>{" "}
              {session.maxSeats - session.bookedSeats || "Not specified"}
            </div>
          </div>

          <div className="p-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              <i className="fas fa-calendar-alt text-black"></i> Scheduled Dates
            </h2>
            <div className="border border-gray-300 rounded-lg p-2">
              <Calendar tileContent={tileContent} onClickDay={handleDayClick} />
            </div>
          </div>

          {role === "teacher" ? (
            <div className="flex justify-between mt-8 gap-4">
              <Button
                label={
                  <>
                    <i className="fas fa-pen mr-2"></i> Mark Attendance
                  </>
                }
                name="mark-attendance"
                onClick={handleClick}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg flex-1"
              />
              <Button
                label={
                  <>
                    <i className="fas fa-upload mr-2"></i> Upload Materials
                  </>
                }
                name="upload-materials"
                onClick={handleClick}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg flex-1"
              />
            </div>
          ) : (
            <div className="flex justify-between mt-8 gap-4">
              <Button
                label={
                  <>
                    <i className="fas fa-eye mr-2"></i> View Attendance
                  </>
                }
                name="view-attendance"
                onClick={() =>
                  navigate(`/student/session/${session._id}/view-attendance`)
                }
                className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg flex-1"
              />
              <Button
                label={
                  <>
                    <i className="fas fa-file-alt mr-2"></i> View Materials
                  </>
                }
                name="view-materials"
                onClick={() =>
                  navigate(
                    `/student/session/${session._id}/view-materials/${date}`
                  )
                }
                className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded-lg flex-1"
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
