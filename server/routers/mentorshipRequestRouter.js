import  Express  from "express";

import {acceptMentorshipRequest,rejectMentorshipRequest,
    getMentorshipRequests,
    getMentorshipRequestsApreant,
    createMentorshipRequest,
    getMentorshipRequestById} 
    from "../controllers/mentorshipRequestController.js"

import {aprenantAutorisation, mentorAutorisation} from "../middelwares/jwt.js"   

export const mentorshipRequestRouter  = Express.Router()

mentorshipRequestRouter.post("/mentorship/create", aprenantAutorisation, createMentorshipRequest)
mentorshipRequestRouter.post("/mentorship/accept",mentorAutorisation,acceptMentorshipRequest)
mentorshipRequestRouter.put("/rejectMentorship",mentorAutorisation,rejectMentorshipRequest)
mentorshipRequestRouter.get("/getMentorship/:id",mentorAutorisation,getMentorshipRequests)
mentorshipRequestRouter.get("/getMentorshipAprenant/:id",aprenantAutorisation,getMentorshipRequestsApreant)
mentorshipRequestRouter.get("/getRequest/:requestId", getMentorshipRequestById)
