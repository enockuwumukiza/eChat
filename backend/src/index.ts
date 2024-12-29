import express, { Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cloudinary from "cloudinary";
import { Server, Socket } from "socket.io";
import { PORT, app, server } from "./app";
import { dbConnection } from "./config/dbConfig";
import mongoose from "mongoose";
dotenv.config();

// Cloudinary configuration
cloudinary.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});

// Start the server
server.listen(PORT, () => {
    dbConnection();
    console.log(`Server listening on port: ${PORT}`);
});

