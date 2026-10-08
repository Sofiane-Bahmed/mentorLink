
import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

import { Aprenant } from "../models/aprenant.js";
import { Mentor } from "../models/mentor.js"
import { Session } from "../models/session.js";

// consulter son profil

export const viewMentorProfile = async (req, res) => {
  try {
    const { mentorId } = req.params;
    const mentor = await Mentor.findById(mentorId).populate('userInherit');
    if (!mentor) {
      return res.status(404).json({ message: 'Mentor not found' });
    }
    return res.status(200).json(mentor);
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: `Server error: ${error.message}` });
  }
};

// modifier son profil 

export const updateMentorProfile = async (req, res) => {
  const { mentorId } = req.params;

  const {
    lastName,
    firstName,
    company,
    domain,
    experience,
    disponibility,
    about,
    skills,
    localisation,
    responseTime,
    price
  } = req.body;

  try {
    const mentor = await Mentor.findByIdAndUpdate(
      mentorId,
      {
        lastName,
        firstName,
        company,
        domain,
        experience,
        disponibility,
        about,
        skills,
        localisation,
        responseTime,
        price
      },
      {
        new: true,
        runValidators: true
      });

    if (!mentor) {
      return res.status(404).json({ message: "Mentor not found" });
    }

    return res
      .status(200)
      .json({
        message: "Mentor profile updated successfully",
        mentor
      });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong. Please try again later" });
  }
};

// modifier son profilImage 

export const updateMentorImage = async (req, res) => {

  try {
    const { mentorId } = req.params;
    const mentor = await Mentor.findById(mentorId);

    if (!mentor) {
      return res.status(404).json({ message: 'Mentor not found' });
    }

    // Check if there is an image in the request

    if (!req.file) {
      return res.status(400).json({ message: 'Image not provided' });
    }

    //verify image url existence 
    if (mentor?.image?.publicId) {
      try {
        await cloudinary.uploader.destroy(mentor.image.publicId);
      } catch (err) {
        console.error("Cloudinary destroy error:", err);
      }
    }

    // Upload image to Cloudinary
    const file = req.file
    const fileTobase64 = Buffer.from(file.buffer).toString("base64")
    const fileUrl = `data:${file.mimetype};base64,${fileTobase64}`
    const result = await cloudinary.uploader.upload(fileUrl);

    // Update the mentor's profile with the Cloudinary image URL

    mentor.image = {
      publicId: result.public_id,
      url: result.secure_url,
    };
    await mentor.save();

    // Remove the uploaded image from the server's upload directory (optional)
    // fs.unlinkSync(req.file.path);

    return res.status(200).json({ message: 'Mentor profile image updated successfully', mentor });
  } catch (error) {
    // console.log(error);
    return res.status(500).json({ message: `Server error: ${error.message}` });
  }
};

// consultter l'historique des sessions de mentorat

export const mentorSessionHistory = async (req, res) => {

  const { mentorId } = req.params;

  try {

    const mentor = await Mentor.findById(mentorId)

    if (!mentor) {
      return res.status(404).json({ message: "mentor not found" })
    }
    const sessions = mentor.sessions

    res.status(200).json({ sessions })

  } catch (error) {
    console.log(error)
  }

};

// suivre le progrès d'un aprenant

export const aprenantProgress = async (req, res) => {

  const { sessionId, note } = req.body;

  try {

    const session = await Session.findById(sessionId).populate("mentor aprenant");
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    // Check if the mentor has already rated this session
    if (session.hasRated) {
      return res.status(400).json({ message: "Mentor has already rated this session" });
    }

    // Ensure the note is within the valid range (0-10)

    if (note < 0 || note > 10) {
      return res.status(400).json({ message: "Invalid note. Note should be between 0 and 10" });
    }

    // Update the session's note and set hasRated to true

    await Session.findByIdAndUpdate(sessionId,
      {
        note,
        hasRated: true
      },
      {
        new: true,
        runValidators: true,
      }
    );

    // Calculate the overall progress for the apprentice
    const aprenantSessions = await Session.find({ aprenant: session.aprenant._id, hasRated: true });
    const aprenantProgress = aprenantSessions.reduce((total, s) => total + s.note, 0);
    const aprenantOverallProgress = aprenantProgress / aprenantSessions.length;

    // Update the apprentice's overall progress
    sessionId = session.aprenant._id
    await Aprenant.findByIdAndUpdate(sessionId, {
      progress: aprenantOverallProgress
    })

    res.status(200).json({ message: "Apprentice noted successfully." });
  } catch (error) {
    res.status(500).json({ message: "An error occurred while processing the request." });
  }
};


// consulter un aprenant specific : 
export const getSpecificAprentice = async (req, res) => {

  const { aprenantId } = req.params;
  try {
    const aprenant = await Aprenant.findById(aprenantId)

    if (!aprenant) {
      return res.status(404).json({ message: "aprenant not found." });
    }

    res.status(200).json({ aprenant });
  } catch (error) {
    res.status(500).json({ message: `Error retrieving mentor information: ${error.message}` });
  }
}