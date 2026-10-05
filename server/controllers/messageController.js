import { Message } from "../models/message.js"
import { User } from "../models/user.js";
import { sendNotification } from "../socket.js";
import mongoose from "mongoose";

// envoyer un message
export const sendMessage = async (req, res) => {
  const { senderId, receiverId, message } = req.body;

  try {
    const sender = await User.findById(senderId);
    const receiver = await User.findById(receiverId);

    if (!sender || !receiver) {
      return res.status(404).json({ message: "Sender or receiver not found." });
    }

    const conversationId = [senderId, receiverId].sort().join("_");

    const newMessage = await Message.create({
      sender: senderId,
      receiver: receiverId,
      message,
      conversationId
    })

    // Notify Receiver
    sendNotification(receiverId, {
      type: 'NEW_MESSAGE',
      message: `New message from ${sender.firstName}`,
      data: {
        _id: newMessage._id,
        senderId,
        message,
        conversationId,
        createdAt: newMessage.createdAt
      }
    });

    res.status(201).json({ message: "Message sent successfully.", newMessage });
  } catch (error) {
    res.status(500).json({ message: `Error sending message: ${error.message}` });
  }
};

// recuperer les messages
export const getMessages = async (req, res) => {
  const { senderId, receiverId } = req.query;

  try {
    const conversationId = [senderId, receiverId].sort().join("_");

    const messages = await Message.find({ conversationId })
      .sort({ createdAt: 1 })
      .populate("sender receiver", "firstName lastName image");

    res.status(200).json({ messages });
  } catch (error) {
    res.status(500).json({ message: `Error getting messages: ${error.message}` });
  }
};

// recuperer les conversations avec le dernier message et le nombre de messages non lus
export const getConversations = async (req, res) => {
  const { userId } = req.params;
  try {
    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [
            { sender: new mongoose.Types.ObjectId(userId) },
            { receiver: new mongoose.Types.ObjectId(userId) }
          ]
        }
      },
      {
        $sort: { createdAt: -1 }
      },
      {
        $group: {
          _id: "$conversationId",
          lastMessage: { $first: "$$ROOT" },
          unreadCount: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$receiver", new mongoose.Types.ObjectId(userId)] },
                    { $eq: ["$read", false] }
                  ]
                },
                1,
                0
              ]
            }
          }
        }
      },
      {
        $lookup: {
          from: "users",
          let: {
            sender: "$lastMessage.sender",
            receiver: "$lastMessage.receiver"
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $in: ["$_id", ["$$sender", "$$receiver"]] },
                    { $ne: ["$_id", new mongoose.Types.ObjectId(userId)] }
                  ]
                }
              }
            },
            {
              $project: {
                firstName: 1,
                lastName: 1,
                image: 1,
                userRole: 1
              }
            }
          ],
          as: "contact"
        }
      },
      {
        $unwind: "$contact"
      },
      {
        $project: {
          contact: 1,
          lastMessage: {
            message: "$lastMessage.message",
            createdAt: "$lastMessage.createdAt",
            sender: "$lastMessage.sender"
          },
          unreadCount: 1
        }
      },
      {
        $sort: { "lastMessage.createdAt": -1 }
      }
    ]);

    res.status(200).json({ conversations });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// marquer les messages d'une conversation comme lus
export const markAsRead = async (req, res) => {
  const { userId, contactId } = req.body;
  try {
    const conversationId = [userId, contactId].sort().join("_");
    await Message.updateMany(
      { conversationId, receiver: userId, read: false },
      { $set: { read: true } }
    );
    res.status(200).json({ message: "Messages marked as read" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// supprimer un message
export const deleteMessage = async (req, res) => {
  const { messageId, userId } = req.body;
  try {
    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    // Verify that the user is the sender
    if (message.sender.toString() !== userId) {
      return res.status(403).json({ message: "You can only delete your own messages" });
    }

    await Message.findByIdAndDelete(messageId);

    // Notify Receiver
    sendNotification(message.receiver.toString(), {
      type: 'DELETE_MESSAGE',
      data: { messageId, conversationId: message.conversationId }
    });

    res.status(200).json({ message: "Message deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
