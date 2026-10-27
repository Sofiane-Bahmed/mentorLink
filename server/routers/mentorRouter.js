import Express from "express";

import {
    viewMentorProfile, updateMentorProfile,
    mentorSessionHistory,
    aprenantProgress,
    getSpecificAprentice,
    updateMentorImage
} from "../controllers/mentorController.js"
import { mentorAutorisation } from "../middelwares/jwt.js"
import { upload } from "../middelwares/multer.js"

export const mentorRouter = Express.Router()

mentorRouter.get("/me/:id", viewMentorProfile)
mentorRouter.put("/modifierProfile/:id", mentorAutorisation, updateMentorProfile)
mentorRouter.put("/modifierProfileImage/:id", mentorAutorisation, upload.single("image"), updateMentorImage)
mentorRouter.get("/Aprentice/:id", mentorAutorisation, getSpecificAprentice)
mentorRouter.get("/session/:id", mentorAutorisation, mentorSessionHistory)
mentorRouter.post("/Progress", mentorAutorisation, aprenantProgress)
