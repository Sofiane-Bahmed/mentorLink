import  Express  from "express";

import {launchMentoringSession, getSessionsHistory} from "../controllers/sessionController.js"

export const sessionRouter = Express.Router()

sessionRouter.post("/launch",launchMentoringSession)
sessionRouter.get("/history/:userId", getSessionsHistory)