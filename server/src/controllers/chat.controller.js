// Chat Controller
const Chat = require("../models/chat.model"); // Assuming a Chat model exists

exports.getConversation = async (req, res) => {
    try {
      const { senderId, recipientId } = req.params;
      const messages = await Chat.find({
        $or: [
          { sender: senderId, recipient: recipientId },
          { sender: recipientId, recipient: senderId },
        ],
      }).populate("sender", "name").populate("recipient", "name");
  
      if (messages.length === 0) {
        // No conversation found, return empty array instead of 404
        return res.status(200).json([]);
      }
  
      res.status(200).json(messages);
    } catch (error) {
      res.status(500).json({ message: "Error fetching messages", error: error.message });
    }
  };

exports.sendMessage = async (req, res) => {
  try {
    const { sender, recipient, message } = req.body;
    const newMessage = new Chat({
      sender,
      recipient,
      message,
    });

    await newMessage.save();
    res.status(201).json({ newMessage });
  } catch (error) {
    res.status(500).json({ message: "Error sending message", error: error.message });
  }
};
