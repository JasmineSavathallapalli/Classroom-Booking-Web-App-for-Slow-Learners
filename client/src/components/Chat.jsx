import { useEffect, useState, useRef } from "react";
import axios from "axios";

export default function Chat({ senderId, recipientId }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  // Fetch authenticated user ID
  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:5000/auth/verify", { withCredentials: true })
      .then((response) => {
        setUserId(response.data.user._id);
      })
      .catch((err) => {
        console.error("Error fetching user:", err);
        setError("Failed to authenticate user");
        setLoading(false);
      });
  }, []);

  // Fetch conversation
  useEffect(() => {
    if (!userId || senderId !== userId) return; // Ensure sender is authenticated user
    setLoading(true);
    axios
      .get(`http://localhost:5000/api/chat/conversation/${senderId}/${recipientId}`, {
        withCredentials: true,
      })
      .then((res) => {
        setMessages(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching messages:", err);
        setError("Failed to load messages");
        setLoading(false);
      });
  }, [senderId, recipientId, userId]);

  // Send message
  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const msg = {
      sender: senderId,
      recipient: recipientId,
      message: newMessage,
    };

    try {
      const res = await axios.post("http://localhost:5000/api/chat/", msg, {
        withCredentials: true,
      });
      setMessages((prev) => [...prev, res.data.newMessage]);
      setNewMessage("");
    } catch (err) {
      console.error("Send message error:", err);
      setError("Failed to send message");
    }
  };

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (error) {
    return <div className="text-red-500 text-center p-4">{error}</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-4 border rounded shadow h-[70vh] flex flex-col">
  <div className="flex-1 overflow-y-auto mb-4 space-y-2 flex flex-col">
    {loading ? (
      <div className="text-center p-4">Loading...</div>
    ) : messages.length === 0 ? (
      <div className="text-center p-4 text-gray-500">No messages yet</div>
    ) : (
      messages.map((msg) => (
        <div
          key={msg._id}
          className={`p-2 rounded max-w-[70%] ${
            (msg.sender._id || msg.sender) === userId
              ? "bg-gray-200 self-start text-left"
              : "bg-blue-200 self-end text-right"
          }`}
        >
          <p>{msg.message}</p>
          <p className="text-xs text-gray-500 mt-1">
            {new Date(msg.timestamp).toLocaleTimeString()}
          </p>
        </div>
      ))
    )}
    <div ref={messagesEndRef}></div>
  </div>
  <div className="flex gap-2">
    <input
      className="flex-1 border rounded p-2"
      value={newMessage}
      onChange={(e) => setNewMessage(e.target.value)}
      onKeyDown={(e) => e.key === "Enter" && sendMessage()}
      placeholder="Type your message..."
      disabled={loading || !userId}
    />
    <button
      className="bg-blue-600 text-white px-4 py-2 rounded disabled:bg-gray-400"
      onClick={sendMessage}
      disabled={loading || !newMessage.trim() || !userId}
    >
      Send
    </button>
  </div>
</div>
  );
}