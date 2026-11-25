import Express  from "express";

import {sendMessage,getMessages, getConversations, markAsRead, deleteMessage} from "../controllers/messageController.js"
import { generalAutorisation } from "../middelwares/jwt.js";



export const messageRouter = Express.Router()

messageRouter.post("/send", generalAutorisation, sendMessage)
messageRouter.get("/", generalAutorisation, getMessages)
messageRouter.get("/conversations/:userId", generalAutorisation, getConversations)
messageRouter.post("/markAsRead", generalAutorisation, markAsRead)
messageRouter.delete("/delete", generalAutorisation, deleteMessage)

