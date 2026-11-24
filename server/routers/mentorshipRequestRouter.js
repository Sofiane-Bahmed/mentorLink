import  Express  from "express";

import {acceptMentorshipRequest,rejectMentorshipRequest,
    getMentorshipRequests,
    getMentorshipRequestsApreant,
    createMentorshipRequest,
    getMentorshipRequestById} 
    from "../controllers/mentorshipRequestController.js"

import {aprenantAutorisation, mentorAutorisation} from "../middelwares/jwt.js"   

export const mentorshipRequestRouter  = Express.Router()

mentorshipRequestRouter.post("/create", aprenantAutorisation, createMentorshipRequest)
mentorshipRequestRouter.post("/accept",mentorAutorisation,acceptMentorshipRequest)
mentorshipRequestRouter.put("/reject",mentorAutorisation,rejectMentorshipRequest)
mentorshipRequestRouter.get("/:id",mentorAutorisation,getMentorshipRequests)
mentorshipRequestRouter.get("/aprenant/:id",aprenantAutorisation,getMentorshipRequestsApreant)
mentorshipRequestRouter.get("/:requestId", getMentorshipRequestById)
