import express, { Express, Request, Response } from "express";
import cors from 'cors'
import cookieParser from "cookie-parser";
import dotenv from 'dotenv'
import { Server } from 'socket.io'
import { userRoutes } from "./routes/user.routes";
import { groupRoutes } from "./routes/group.routes";
import { messageRoutes } from "./routes/message.routes";
import { app, server } from "./socket/socket";

dotenv.config();

//built-in middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//custom middlewares

app.use(cors());
app.use(cookieParser());

const PORT = process.env.PORT;

app.use('/api/users', userRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/messages', messageRoutes);



export {
    app, PORT, server
}