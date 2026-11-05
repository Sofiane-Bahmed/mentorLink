import  Express  from "express";

import {launchMentoringSession, getSessionsHistory} from "../controllers/sessionController.js"
import {mentorAutorisation} from "../middelwares/jwt.js"

export const sessionRouter = Express.Router()

sessionRouter.post("/session/launch",launchMentoringSession)
sessionRouter.get("/history/:userId", getSessionsHistory)