import React, { useState, useEffect } from "react";
import Chat from "../components/Chat";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function ChatBox() {
  const { teacherId } = useParams();
  const [studentId, setStudentId] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:5000/auth/verify", { withCredentials: true })
      .then((response) => {
        if (response.data?.user) {
          setStudentId(response.data.user._id);
        }
      })
      .catch((error) => console.error("Error fetching student ID:", error));
  }, []);

  if (!studentId) return <p>Loading chat...</p>;

  return (
    <div>
      <h1 className="text-xl font-bold text-center">Chat with Teacher</h1>
      <Chat senderId={studentId} recipientId={teacherId} />
    </div>
  );
}
