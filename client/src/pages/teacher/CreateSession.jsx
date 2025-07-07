import { useEffect, useState } from "react";
import axios from "axios";
import {
  MultiDropDown,
  Select,
  TimeRangePicker,
  Button,
  Input,
} from "../../components";

import DatePicker from "react-multi-date-picker";
import Navbar from "../../components/NavBar";

export default function CreateSession() {
  const [previewMode, setPreviewMode] = useState(false);
  const [submissionMessage, setSubmissionMessage] = useState(null); // For feedback

  const [user, setUser] = useState(null);
  const [clsrooms, setClsRooms] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/auth/verify", { withCredentials: true })
      .then((response) => {
        setUser(response.data.user);
      })
      .catch(() => {
        console.log("User not authenticated");
      });
  }, []);

  const [sessionData, setSessionData] = useState({
    subject: "",
    timeSlot: { startTime: null, endTime: null },
    sessionType: "Single",
    dates: [],
    classroom: undefined,
    maxSeats: 0,
    programme: "",
  });

  useEffect(() => {
    if (sessionData.dates.length > 0) {
      axios
        .get("http://localhost:5000/api/classrooms/available", {
          params: {
            dates: sessionData.dates,
            startTime: sessionData.timeSlot.startTime,
            endTime: sessionData.timeSlot.endTime,
          },
          withCredentials: true,
        })
        .then((response) => {
          setClsRooms(response.data.availableClsrooms);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [sessionData.dates]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSessionData({ ...sessionData, [name]: value });
  };

  const handleWeekLong = (e) => {
    const { name, value } = e.target;
    const getDatesUntilSunday = (selectedDate) => {
      const date = new Date(selectedDate);
      const dayOfWeek = date.getDay();

      const dates = [];
      for (let i = 0; i <= 6 - dayOfWeek; i++) {
        const nextDate = new Date(date);
        nextDate.setDate(date.getDate() + i);
        dates.push(nextDate.toISOString().split("T")[0]); // Format as YYYY-MM-DD
      }
      return dates;
    };
    setSessionData({ ...sessionData, dates: getDatesUntilSunday(value) });
  };

  const handleSemesterLong = (daysSelected) => {
    console.log("Inside");
    const getSemesterDates = (days) => {
      const today = new Date();
      let semesterStart, semesterEnd;

      // Determine the current semester based on the month
      if (today.getMonth() >= 5 && today.getMonth() <= 10) {
        // Fall Semester [June to November]
        semesterStart = new Date(today.getFullYear(), 5, 1);
        semesterEnd = new Date(today.getFullYear(), 10, 30);
      } else {
        // Winter Semester [December to May]
        semesterStart = new Date(
          today.getMonth() === 11
            ? today.getFullYear()
            : today.getFullYear() - 1,
          11,
          1
        );
        semesterEnd = new Date(
          today.getMonth() === 11
            ? today.getFullYear() + 1
            : today.getFullYear(),
          4,
          31
        );
      }

      const result = [];

      let currentDate = new Date(semesterStart);
      while (currentDate <= semesterEnd) {
        const currentDayName = currentDate.toLocaleDateString("en-US", {
          weekday: "long",
        });

        if (days.includes(currentDayName)) {
          result.push(new Date(currentDate));
        }

        currentDate.setDate(currentDate.getDate() + 1);
      }

      return result.map((date) => date.toISOString().split("T")[0]); // Return in YYYY-MM-DD format
    };
    setSessionData({ ...sessionData, dates: getSemesterDates(daysSelected) });
  };

  const handleCustomDates = (dates) => {
    var result = [];
    dates.forEach((date) => {
      result.push(new Date(date.toString()).toISOString().split("T")[0]);
    });
    setSessionData({ ...sessionData, dates: result });
  };

  const handleSubmit = () => {
    var finalData = {
      ...sessionData,
      maxSeats: parseInt(sessionData.maxSeats),
      sessionName: `${sessionData.subject}-${sessionData.sessionType}-${sessionData.timeSlot.startTime}-${sessionData.timeSlot.endTime}-${sessionData.classroom}`,
      teacherId: user._id,
    };
    axios
      .post("http://localhost:5000/api/sessions/create", finalData, {
        withCredentials: true,
      })
      .then((response) => {
        setSubmissionMessage({
          type: "success",
          text: "Session created successfully!",
        });
      })
      .catch((error) => {
        setSubmissionMessage({
          type: "error",
          text: "Error creating session. Please try again." + error.message,
        });
      });
  };

  useEffect(() => console.log(sessionData), [sessionData]);

  return (
    <>
      <Navbar role={"teacher"} />
      <div className="bg-[url('/images/background1.png')] bg-cover bg-center min-h-screen flex items-center justify-center p-6">
        <div className="bg-white w-full max-w-4xl p-8 rounded-2xl shadow-2xl">
          {submissionMessage && (
            <div
              className={`text-center p-3 rounded-lg mb-6 font-medium ${
                submissionMessage.type === "success"
                  ? "bg-green-100 text-green-600"
                  : "bg-red-100 text-red-600"
              }`}
            >
              <i
                className={`fas ${
                  submissionMessage.type === "success"
                    ? "fa-check-circle"
                    : "fa-times-circle"
                } mr-2`}
              ></i>
              {submissionMessage.text}
            </div>
          )}

          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-blue-700 flex items-center justify-center gap-2">
              <i className="fas fa-calendar-plus"></i>
              {previewMode ? "Review Your Selections" : "Create a Session"}
            </h1>
          </div>

          {!previewMode && (
            <div className="space-y-6">
              <Select
                label={
                  <span className="flex items-center gap-2 text-sm font-semibold">
                    <i className="fas fa-book"></i> Select Subject
                  </span>
                }
                name="subject"
                options={
                  user
                    ? user.subjectsTeaching
                    : ["No Subjects. Please add more via your profile."]
                }
                onChange={handleChange}
                value={sessionData.subject || ""}
              />

              <div>
                <label className="block text-sm font-semibold mb-1 flex items-center gap-2">
                  <i className="fas fa-tags"></i> Programme
                </label>
                <Input
                  name="programme"
                  value={sessionData.programme}
                  onChange={handleChange}
                  placeholder="Enter programme"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1 flex items-center gap-2">
                  <i className="fas fa-clock"></i> Select Time Slot
                </label>
                <TimeRangePicker
                  onTimeSelect={(time) =>
                    setSessionData({
                      ...sessionData,
                      timeSlot: {
                        startTime: time.startTime,
                        endTime: time.endTime,
                      },
                    })
                  }
                />
              </div>

              <Select
                label={
                  <span className="flex items-center gap-2 text-sm font-semibold">
                    <i className="fas fa-list-alt"></i> Choose Session Type
                  </span>
                }
                name="sessionType"
                options={[
                  {
                    value: "Single",
                    title: "Create the session only for a single day",
                  },
                  {
                    value: "Week-Long",
                    title: "Create the session for a full week",
                  },
                  {
                    value: "Semester-Long",
                    title: "Create the session for the entire semester",
                  },
                  {
                    value: "Custom",
                    title: "Create the session on selected custom dates",
                  },
                ]}
                onChange={handleChange}
                value={sessionData.sessionType}
              />

              {sessionData.sessionType === "Single" && (
                <div>
                  <label className="block text-sm font-semibold mb-1 flex items-center gap-2">
                    <i className="fas fa-calendar-day"></i> Select Date
                  </label>
                  <input
                    type="date"
                    onChange={(e) =>
                      setSessionData({
                        ...sessionData,
                        dates: [e.target.value],
                      })
                    }
                    className="p-2 border rounded w-full focus:ring-2 focus:ring-blue-300"
                  />
                </div>
              )}

              {sessionData.sessionType === "Week-Long" && (
                <div>
                  <label className="block text-sm font-semibold mb-1 flex items-center gap-2">
                    <i className="fas fa-calendar-week"></i> Select Start Date
                    of the Week
                  </label>
                  <input
                    type="date"
                    onChange={(e) => handleWeekLong(e)}
                    className="p-2 border rounded w-full focus:ring-2 focus:ring-blue-300"
                  />
                </div>
              )}

              {sessionData.sessionType === "Semester-Long" && (
                <div>
                  <label className="block text-sm font-semibold mb-1 flex items-center gap-2">
                    <i className="fas fa-calendar-alt"></i> Select Days of the
                    Week
                  </label>
                  <MultiDropDown
                    options={[
                      "Monday",
                      "Tuesday",
                      "Wednesday",
                      "Thursday",
                      "Friday",
                      "Saturday",
                      "Sunday",
                    ]}
                    defaultOptionText="Select the day(s)"
                    selectedOptionText="Selected Days are"
                    onSelectionChange={handleSemesterLong}
                  />
                </div>
              )}

              {sessionData.sessionType === "Custom" && (
                <div>
                  <label className="block text-sm font-semibold mb-1 flex items-center gap-2">
                    <i className="fas fa-calendar-check"></i> Select Custom
                    Dates
                  </label>
                  <DatePicker multiple onChange={handleCustomDates} sort />
                </div>
              )}

              <Select
                label={
                  <span className="flex items-center gap-2 text-sm font-semibold">
                    <i className="fas fa-school"></i> Select Classroom
                  </span>
                }
                name="classroom"
                options={clsrooms.map((cls) => cls.name)}
                onChange={handleChange}
                value={sessionData.classroom || ""}
              />

              <div>
                <label className="block text-sm font-semibold mb-1 flex items-center gap-2">
                  <i className="fas fa-chair"></i> Max Seats
                </label>
                <Input
                  name="maxSeats"
                  value={sessionData.maxSeats}
                  onChange={handleChange}
                  placeholder="Enter seat capacity"
                />
              </div>

              <div className="pt-4">
                <Button
                  label={
                    <span className="flex items-center justify-center gap-2">
                      <i className="fas fa-eye"></i> Preview Session
                    </span>
                  }
                  name="confirm"
                  onClick={() => setPreviewMode(true)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition"
                />
              </div>
            </div>
          )}

          {previewMode && (
            <div className="p-6 border rounded-xl shadow-lg bg-white mt-6 space-y-4">
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <i className="fas fa-book text-blue-500"></i>
                  <span className="font-semibold">Subject:</span>
                  <span>{sessionData.subject || "Not selected"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <i className="fas fa-tags text-blue-500"></i>
                  <span className="font-semibold">Programme:</span>
                  <span>{sessionData.programme || "Not selected"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <i className="fas fa-clock text-blue-500"></i>
                  <span className="font-semibold">Time Slot:</span>
                  <span>
                    {sessionData.timeSlot.startTime || "N/A"} -{" "}
                    {sessionData.timeSlot.endTime || "N/A"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <i className="fas fa-list text-blue-500"></i>
                  <span className="font-semibold">Session Type:</span>
                  <span>{sessionData.sessionType}</span>
                </div>
                <div className="flex items-start gap-2">
                  <i className="fas fa-calendar-alt text-blue-500 mt-1"></i>
                  <span className="font-semibold">Dates:</span>
                  <div className="ml-2">
                    {sessionData.dates.length > 0 ? (
                      <ul className="list-disc pl-4">
                        {sessionData.dates.map((date, index) => (
                          <li key={index}>{date}</li>
                        ))}
                      </ul>
                    ) : (
                      <span>No dates selected</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <i className="fas fa-school text-blue-500"></i>
                  <span className="font-semibold">Classroom:</span>
                  <span>{sessionData.classroom || "Not selected"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <i className="fas fa-chair text-blue-500"></i>
                  <span className="font-semibold">Maximum Seats:</span>
                  <span>{sessionData.maxSeats || "Not specified"}</span>
                </div>
              </div>

              <div className="flex justify-between pt-6 gap-4">
                <button
                  className="w-1/2 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition"
                  onClick={handleSubmit}
                >
                  <i className="fas fa-check-circle mr-2"></i> Confirm
                </button>
                <button
                  className="w-1/2 bg-gray-500 hover:bg-gray-600 text-white py-2 rounded-lg transition"
                  onClick={() => setPreviewMode(false)}
                >
                  <i className="fas fa-arrow-left mr-2"></i> Go Back
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
