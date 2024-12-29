import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';
import { HttpStatusCodes } from "../utils/httpStatusCodes";
import { User, IUser } from "../models/user.model";
import mongoose from 'mongoose'

dotenv.config();

// Extend Express's Request interface to include the user property
declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload | IUser;
        }
    }
}

export const verifyToken: (req: Request, res: Response, next: NextFunction) => void = async(req, res, next) => {
    try {
        const token = req.cookies?.accessToken; // Ensure cookies exist
        if (!token) {
            return res.status(HttpStatusCodes.UNAUTHORIZED).json({
                message: 'Unauthorized -- Access Denied',
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

        const user = await User.findById(decoded._id as mongoose.Types.ObjectId);

        if (!user) {
            return res.status(HttpStatusCodes.UNAUTHORIZED).json({
                message: "User not found -- Access Denied",
            });
        }

        // Attach the user to the request object
        req.user = user;

        next();
    } catch (error) {
        console.error(`Invalid token: ${error}`);
        return res.status(HttpStatusCodes.UNAUTHORIZED).json({
            message: 'Invalid or expired token -- please log in and try again.',
        });
    }
};
