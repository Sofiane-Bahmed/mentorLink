import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser"
import cors from "cors"
import {v2 as cloudinary} from 'cloudinary';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

import { adminRouter } from "./routers/adminRouter.js"
import { mentorRouter } from "./routers/mentorRouter.js"
import { aprenantRouter } from "./routers/aprenantRouter.js"
import { userRouter } from "./routers/userRouter.js"
import { sessionRouter } from "./routers/sessionRouter.js"
import { sessionFeedbackRouter } from "./routers/sessionFeedbackRouter.js"
import { mentorshipRequestRouter } from "./routers/mentorshipRequestRouter.js"
import { messageRouter } from "./routers/messageRouter.js";
import { streamRouter } from "./routers/streamRouter.js";
import { initSocket } from "./socket.js";

const port = process.env.PORT || 8082;
const dbURI = process.env.DBURI;

export const app = express();

mongoose.set("strictQuery", true);
mongoose
  .connect(dbURI)
  .then((result) => {
    const server = app.listen(port, () => {
      console.log(`this app is running in port http://localhost:${port}`);
    });
    initSocket(server);
  })
  .catch((err) => {
    console.log("Mongoose connection error:", err);
  });

// cloudinary configuration 

cloudinary.config({
  cloud_name: 'devq06psf',
  api_key: '314892682655296',
  api_secret: 'cn077LJvBNiAM4OXA8D_CZl5VyQ',
});


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

const allowedOrigins = ["http://localhost:5173", "http://127.0.0.1:5173"];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  optionsSuccessStatus: 204,
  credentials: true
}))

// app.use("/admins", adminRouter)
app.use("/mentors", mentorRouter);
app.use("/aprenants", aprenantRouter)
app.use("/users", userRouter)
app.use("/sessions", sessionRouter)
app.use("/sessionFeedbacks", sessionFeedbackRouter)
app.use("/requests", mentorshipRequestRouter)
app.use("/message", messageRouter)
app.use("/stream", streamRouter)

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ message: 'Internal Server Error', error: err.message });
});
