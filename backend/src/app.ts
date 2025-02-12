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
dotenv.config();

//built-in middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//custom middlewares

app.use(cors(corsConfig));
app.use(cookieParser());

const PORT = process.env.PORT || 5000;

app.use('/api/users', userRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/messages', messageRoutes);


app.get('/',(req:Request, res:Response) =>{
    res.send("<h1>Welcome to eChat</h1>")
})

export {
    app, PORT, server
}