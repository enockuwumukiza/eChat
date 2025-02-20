import express, { Express, } from "express";
import { verifyToken } from "../middlewares/VerifyToken";
import { registerUser, loginUser, updateUser, deleteUser, logoutUser, getUserById, getAllUsers, searchUsers, updateUserProfile, addContact, getContacts, removeContact, getUsersWhoAddedMe } from "../controllers/user.controller";
import { uploader } from "../middlewares/uploader";

const userRoutes = express.Router();

userRoutes.route('/')
    .get(verifyToken, getAllUsers)
    .post(uploader, registerUser)


userRoutes.post('/addContacts', verifyToken, addContact);
userRoutes.get('/getContacts', verifyToken, getContacts);
userRoutes.get('/getContactsMe', verifyToken, getUsersWhoAddedMe);
userRoutes.post('/login', loginUser);
userRoutes.post('/logout', logoutUser);
userRoutes.get('/search', verifyToken, searchUsers);
userRoutes.put('/update', verifyToken, uploader, updateUserProfile);

userRoutes.post('/removeContact/:contactId', verifyToken, removeContact);

userRoutes.route('/:id')
    .get(verifyToken, getUserById)
    .put(verifyToken, updateUser)
    .delete(verifyToken, deleteUser);


export {
    userRoutes
}