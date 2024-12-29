import express, { Express, } from "express";
import { verifyToken } from "../middlewares/VerifyToken";
import { registerUser, loginUser, updateUser, deleteUser, logoutUser, getUserById, getAllUsers, searchUsers } from "../controllers/user.controller";
import { uploader } from "../middlewares/uploader";

const userRoutes = express.Router();

userRoutes.route('/')
    .get(verifyToken, getAllUsers)
    .post(uploader, registerUser)

userRoutes.post('/login', loginUser);
userRoutes.post('/logout', logoutUser);
userRoutes.get('/search', verifyToken, searchUsers);

userRoutes.route('/:id')
    .get(verifyToken, getUserById)
    .put(verifyToken, updateUser)
    .delete(verifyToken, deleteUser)


export {
    userRoutes
}