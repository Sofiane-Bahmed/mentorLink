import { Aprenant } from '../models/aprenant.js';
import { Mentor } from '../models/mentor.js';
import { MentorshipRequest } from '../models/mentorshipRequest.js';
import { sendNotification } from '../socket.js';


// create a mentorship request
export const createMentorshipRequest = async (req, res) => {
  try {
    const { aprenantId, mentorId, message } = req.body;

    // Check if a request already exists
    const existingRequest = await MentorshipRequest.findOne({
      aprenant: aprenantId,
      mentor: mentorId,
      status: { $in: ["pending", "accepted"] }
    });

    if (existingRequest) {
      if (existingRequest.status === "pending") {
        return res.status(400).json({ message: "A pending request already exists." });
      } else {
        return res.status(400).json({ message: "You are already mentored by this person." });
      }
    }

    const newRequest = await MentorshipRequest.create({
      aprenant: aprenantId,
      mentor: mentorId,
      message,
    });

    // Update Aprenant and Mentor models
    const aprenant = await Aprenant.findByIdAndUpdate(aprenantId, {
      $push: { mentorshipsRequests: newRequest._id },
    });
    await Mentor.findByIdAndUpdate(mentorId, {
      $push: { mentorshipsRequests: newRequest._id },
    });

    // Notify Mentor
    sendNotification(mentorId, {
      type: 'NEW_REQUEST',
      message: `${aprenant.firstName} sent you a mentorship request.`,
      requestId: newRequest._id
    });

    res.status(201).json({ message: "Mentorship request sent successfully", request: newRequest });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Consulter les demandes de mentorat

export const getMentorshipRequests = async (req, res) => {

  const { mentorId } = req.params
  try {
    const mentor = await Mentor.findById(mentorId).populate({
      path: "mentorshipsRequests",
      populate: { path: "aprenant" }
    });

    if (!mentor || !mentor.mentorshipsRequests) {
      return res.json({ message: "there are no requests" })
    }

    res.send({ requests: mentor.mentorshipsRequests })

  } catch (error) {
    console.log(error)
    res.status(500).send(error.message);
  }
}


// Consulter les demandes de mentorat (Aprenant)

export const getMentorshipRequestsApreant = async (req, res) => {

  const { aprenantId } = req.params
  try {
    const aprenant = await Aprenant.findById(aprenantId).populate({
      path: "mentorshipsRequests",
      populate: { path: "mentor" }
    });

    if (!aprenant || !aprenant.mentorshipsRequests) {
      return res.json({ message: "there are no requests" })
    }

    res.send({ requests: aprenant.mentorshipsRequests })

  } catch (error) {
    console.log(error)
    res.status(500).send(error.message);
  }
}


// get a mentorship request by ID
export const getMentorshipRequestById = async (req, res) => {
  try {
    const { requestId } = req.params;
    const mentorshipRequest = await MentorshipRequest.findById(requestId)
      .populate("aprenant")
      .populate("mentor");

    if (!mentorshipRequest) {
      return res.status(404).json({ message: "Mentorship request not found" });
    }

    res.status(200).json({ request: mentorshipRequest });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// accept a mentorship request  
export const acceptMentorshipRequest = async (req, res) => {
  try {
    const { requestId, mentorId, responseMessage } = req.body;

    // Find the mentor by ID
    const mentor = await Mentor.findById(mentorId);
    if (!mentor) {
      return res.status(404).send('Mentor not found');
    }

    // Find the mentorship request by ID
    const mentorshipRequest = await findByIdAndUpdate(requestId, {
      status: 'accepted',
      responseMessage: responseMessage
    })
    if (!mentorshipRequest) {
      return res.status(404).send('Mentorship request not found');
    }

    // Notify Aprenant
    console.log(`Sending acceptance notification to aprenant: ${mentorshipRequest.aprenant._id.toString()}`);
    sendNotification(mentorshipRequest.aprenant._id.toString(), {
      type: 'REQUEST_ACCEPTED',
      message: `${mentor.firstName} accepted your mentorship request.`,
      requestId: mentorshipRequest._id,
      responseMessage: responseMessage
    });

    res.status(200).json({ message: 'Mentorship request accepted successfully', mentorshipRequest });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

// reject a mentorship request 

export const rejectMentorshipRequest = async (req, res) => {
  const { mentorId, requestId, responseMessage } = req.body
  try {
    const mentor = await Mentor.findById(mentorId)
    if (!mentor) {
      return res.status(404).json({ message: "mentor not found" })
    }

    const mentorshipRequest = await MentorshipRequest.findByIdAndUpdate(requestId, {
      status: "rejected",
      responseMessage: responseMessage
    }, {
      new: true,
      runValidators: true
    });

    if (!mentorshipRequest) {
      return res.status(404).send({ message: "Mentorship request not found" });
    }

    // Notify Aprenant
    console.log(`Sending rejection notification to aprenant: ${mentorshipRequest.aprenant._id.toString()}`);
    sendNotification(mentorshipRequest.aprenant._id.toString(), {
      type: 'REQUEST_REJECTED',
      message: `${mentor.firstName} declined your mentorship request.`,
      requestId: mentorshipRequest._id,
      responseMessage: responseMessage
    });

    res.status(200).send({ message: "Mentorship request rejected", mentorshipRequest });
  } catch (error) {
    res.status(500).send({ message: "Internal server error" });
  }
};

