import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Navbar from "../../components/NavBar";

export default function ViewAttendance() {
  const [user, setUser] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  const { sessionId } = useParams();

  useEffect(() => {
    axios
      .get("http://localhost:5000/auth/verify", { withCredentials: true })
      .then((response) => setUser(response.data.user))
      .catch(() => console.log("User not authenticated"));
  }, []);

  useEffect(() => {
    if (!user) return;
    const fetchAttendance = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/attendance/session/${sessionId}/student/${user._id}`,
          { withCredentials: true }
        );
        setAttendance(res.data);
      } catch (err) {
        console.error("Failed to fetch attendance:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, [user, sessionId]);

  const getStatusIcon = (status) => {
    return status === "Present" ? (
      <i className="fas fa-check-circle text-green-500"></i>
    ) : (
      <i className="fas fa-times-circle text-red-500"></i>
    );
  };

  return (
    <>
      <Navbar role={"student"} />
      <div className="min-h-screen bg-[url('/images/background1.png')] bg-cover bg-center bg-no-repeat flex items-center justify-center">
        <div className="backdrop-blur-sm bg-white/80 max-w-3xl w-full p-6 rounded-xl shadow-md mx-4">
          <h2 className="text-2xl font-bold text-center text-blue-700 mb-4">
            Attendance Overview
          </h2>

          {loading ? (
            <p className="text-center text-gray-600">Loading attendance...</p>
          ) : attendance.length === 0 ? (
            <p className="text-center text-gray-500">
              No attendance records found.
            </p>
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-blue-100 text-blue-800">
                  <th className="p-3 border">Session</th>
                  <th className="p-3 border">Date</th>
                  <th className="p-3 border">Status</th>
                </tr>
              </thead>
              <tbody>
                {attendance.map((record) => (
                  <tr key={record._id} className="hover:bg-gray-50">
                    <td className="p-3 border text-center">
                      {record.session?.subject || "N/A"}
                    </td>
                    <td className="p-3 border text-center">
                      {new Date(record.date).toLocaleDateString()}
                    </td>
                    <td className="p-3 border text-center">
                      {getStatusIcon(record.status)}{" "}
                      <span className="ml-1">{record.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}
