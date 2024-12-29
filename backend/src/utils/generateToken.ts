import jwt from 'jsonwebtoken';
import { Response } from 'express';
import dotenv from 'dotenv';
import { IUser } from '../models/user.model';
import { JwtPayload } from 'jsonwebtoken';
dotenv.config();

export const generateToken = (user: IUser, res: Response):string => {
    try {
        // Generate the JWT token
        const token = jwt.sign(
            {
                _id: user._id,
                name: user.name,
                email:user.email
            },
            process.env.JWT_SECRET as string,
            {
                expiresIn: '7d', // Token validity
                algorithm: 'HS256', // Strong HMAC algorithm
            }
        );

        // Set the token as a secure cookie
        res.cookie('accessToken', token, {
            httpOnly: true, // Prevent JavaScript access
            secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
            sameSite: 'strict', // CSRF protection
        });

        return token;
    } catch (error) {
        console.error('Error generating token:', error);
        throw new Error('Token generation failed');
    }
};
