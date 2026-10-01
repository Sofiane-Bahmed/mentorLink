import { Mentor } from "../models/mentor.js";
import { Aprenant } from "../models/aprenant.js";
import { Session } from "../models/session.js";

// Lancer une session de mentorat
export const launchMentoringSession = async (req, res) => {
  const { mentorId, aprenantId, startTime, link, date } = req.body;

  try {
    // Check if session already exists for this link
    const existingSession = await Session.findOne({ link });
    if (existingSession) {
      return res.status(200).json({ message: "Session already recorded.", session: existingSession });
    }

    const mentor = await Mentor.findById(mentorId);
    const aprenant = await Aprenant.findById(aprenantId);

    if (!mentor || !aprenant) {
      return res.status(404).json({ message: "Mentor or aprenant not found." });
    }

    // Create the new session
    const session = await Session.create({
      mentor: mentorId,
      aprenant: aprenantId,
      startTime,
      endTime: "ongoing", // Will be updated later if needed
      link,
      date: date || new Date()
    })

    mentor.sessions.push(session._id);
    await mentor.save();

    aprenant.sessions.push(session._id);
    await aprenant.save();

    res.status(201).json({ message: "Mentoring session launched successfully.", session });
  } catch (error) {
    res.status(500).json({ message: `Error launching mentoring session: ${error.message}` });
  }
};

// Get session history for a user (Mentor or Aprenant)
export const getSessionsHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role, page = 1, limit = 10, search = "" } = req.query;

    const query = role === 'mentor' ? { mentor: userId } : { aprenant: userId };

    // Search logic (could be improved by populating and searching on partner name)
    // For now, let's just get the sessions and populate partner info

    const sessions = await Session.find(query)
      .populate('mentor', 'firstName lastName mail image')
      .populate('aprenant', 'firstName lastName mail image')
      .sort({ date: -1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Session.countDocuments(query);

    res.status(200).json({
      sessions,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
      totalSessions: total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};