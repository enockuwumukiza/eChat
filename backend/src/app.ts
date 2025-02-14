import express, { Express, Request, Response } from "express";
import cors from 'cors'
import cookieParser from "cookie-parser";
import dotenv from 'dotenv'
import { Server } from 'socket.io'
import { userRoutes } from "./routes/user.routes";
import { groupRoutes } from "./routes/group.routes";
import { messageRoutes } from "./routes/message.routes";
import { app, server } from "./socket/socket";
import { corsConfig } from "./config/corsConfig";
import path from 'path'


dotenv.config();



//built-in middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname,'..','..', 'frontend', 'eChat', 'dist')));

//custom middlewares

app.use(cors(corsConfig));
app.use(cookieParser());

const PORT = process.env.PORT || 5000;

app.use('/api/users', userRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/messages', messageRoutes);

app.use(express.static(path.join(__dirname, '..', '..', 'frontend', 'eChat', 'dist')));

app.get('*',(req:Request, res:Response) =>{
     res.sendFile(path.join(__dirname, '..','..','frontend', 'eChat', 'dist', 'index.html'));
})

export {
    app, PORT, server
}