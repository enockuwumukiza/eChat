import { Request, Response, CookieOptions } from "express";
import cloudinary from "cloudinary";
import expressAsyncHandler from "express-async-handler";
import { User, validateUser } from "../models/user.model";
import { HttpStatusCodes } from "../utils/httpStatusCodes";
import { generateToken } from "../utils/generateToken";
import bcrypt from "bcrypt";
import { getReceiverSocketId, io } from "../socket/socket";
import { Group } from "../models/group.model";
import { sendEmail } from "../utils/sendMail";
import mongoose from 'mongoose'


// Register user
const registerUser = expressAsyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { error } = validateUser(req.body);
  if (error) {
    res.status(HttpStatusCodes.BAD_REQUEST).json({ message: error.details[0].message });
    return;
  }

  const { name, email, password, phone, isAdmin } = req.body;
  if (!name || !email || !password || !phone) {
    res.status(HttpStatusCodes.BAD_REQUEST).json({
      message: "Missing required fields.",
    });
    return;
  }

  const existingUser = await User.findOne({ email });
  const existingPhone = await User.findOne({ phone });
  if (existingUser) {
    res.status(HttpStatusCodes.CONFLICT).json({ message: "Email is already in use!" });
    return;
  }
  if (existingPhone) {
    res.status(HttpStatusCodes.CONFLICT).json({ message: "Phone number is already in use!" });
    return;
  }

  const user = new User({ name, email, password, phone, isAdmin });

  if (req.file) {
    try {
      // Wrapping the upload_stream in a Promise
      const uploadToCloudinary = (fileBuffer: Buffer) =>
        new Promise<string>((resolve, reject) => {
          const uploadStream = cloudinary.v2.uploader.upload_stream(
            {
              resource_type: "image",
              folder: "user_files",
            },
            (error, result) => {
              if (error) {
                return reject(error);
              }
              resolve(result?.secure_url || "");
            }
          );
          uploadStream.end(fileBuffer);
        });

      // Call the function and set the profilePicture
      user.profilePicture = await uploadToCloudinary(req.file.buffer);
    } catch (error) {
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Failed to upload profile picture",
        error,
      });
      return;
    }
  }

  await user.save();
  generateToken(user, res);
  
  res.status(HttpStatusCodes.CREATED).json({ user });
  await sendEmail(user?.email,'https://mybank-tbl5.onrender.com', 'Enock UWUMUKIZA');
});


const getAllUsers = expressAsyncHandler(async (req: Request, res: Response): Promise<void> => {
  const users = await User.find({_id:{$ne: req?.user?._id}}).select('-password');
  if (!users || users.length === 0) {
    res.status(HttpStatusCodes.NOT_FOUND).json({
      message: 'no users found.'
    });
    return;
  }
  res.json({ users });
})

const searchUsers = expressAsyncHandler(async(req: Request, res: Response) : Promise<void> =>{
  const keyword = req.query.search ?
    {
      $or: [
        { name: { $regex: req.query.search, $options: 'i' } },
        { email: { $regex: req.query.search, $options: 'i' } },
        { phone: { $regex: req.query.search, $options: 'i' } }
      ]
    }
    : {};
  
  const users = await User.find(keyword).find({ _id: { $ne: req?.user?._id } });

  if (!users) {
    res.status(HttpStatusCodes.NOT_FOUND).json({
      message: 'no users found.'
    });
    return;
  }
  res.json({ users });
  
})
// Update user
const updateUser = expressAsyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  const updates = req.body;
  const user = await User.findByIdAndUpdate(id, updates, { new: true, runValidators: true });

  if (!user) {
    res.status(HttpStatusCodes.NOT_FOUND).json({ message: `User with ID ${id} not found` });
    return;
  }

  res.json({ user });
});

const updateUserProfile = expressAsyncHandler(async (req: Request, res: Response): Promise<void> => {
  const id = req?.user?._id;

  const user = await User.findById(id);

  if (!user) {
    res.status(HttpStatusCodes.NOT_FOUND).json({ message: `User with ID ${id} not found` });
    return; // Stop execution after sending response
  }

  user.name = req?.body?.name || user?.name;
  user.email = req?.body?.email || user?.email;
  user.phone = req?.body?.phone || user?.phone;
  user.status = req?.body?.status || user?.status;

  if (req.file) {
    try {
      const uploadToCloudinary = (fileBuffer: Buffer) =>
        new Promise<string>((resolve, reject) => {
          const uploadStream = cloudinary.v2.uploader.upload_stream(
            {
              resource_type: "image",
              folder: "user_files",
            },
            (error, result) => {
              if (error) {
                return reject(error);
              }
              resolve(result?.secure_url || "");
            }
          );
          uploadStream.end(fileBuffer);
        });

      // Ensure `profilePicture` is only updated if upload succeeds
      const imageUrl = await uploadToCloudinary(req.file.buffer);
      if (imageUrl) {
        user.profilePicture = imageUrl;
      }
    } catch (error) {
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Failed to update profile picture",
        error,
      });
      return;
    }
  }

  await user.save();

  
  generateToken(user, res); 

  
  res.json({ user });
});


const getUserById = expressAsyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const user = await User.findByIdAndDelete(id);
  if (!user) {
    res.status(HttpStatusCodes.NOT_FOUND).json({
      message: `user with ID ${id} was not found.`
    });
    return;
  }
  res.json({ user });
});

// Delete user
const deleteUser = expressAsyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  const user = await User.findByIdAndDelete(id);
  if (!user) {
    res.status(HttpStatusCodes.NOT_FOUND).json({ message: `User with ID ${id} not found` });
    return;
  }

  res.json({ message: `User ${user.name} deleted successfully` });
});


// Login user
const loginUser = expressAsyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(HttpStatusCodes.BAD_REQUEST).json({ message: "Email and password are required" });
    return;
  }

  const user = await User.findOne({ email });
  if (!user) {
    res.status(HttpStatusCodes.NOT_FOUND).json({ message: `email: ${email} was not found. consider signing up` });
    return;
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    res.status(HttpStatusCodes.UNAUTHORIZED).json({ message: "Invalid credentials" });
    return;
  }


  generateToken(user, res);

  const userId = user?._id;

  if (!userId) {
    res.status(HttpStatusCodes.UNAUTHORIZED).json({
      message: 'user is not authenticated'
    });
    return;
  }

  const groups = await Group.find({ "members.userId": userId });

  if (userId) {
    
      const userSocketId = getReceiverSocketId(user?._id as string);
        if (userSocketId && groups && groups.length > 0) {
          groups.forEach((group) => {
            io.to(userSocketId).emit("group-created", { groupName: group.name });

            const socket = io.sockets.sockets.get(userSocketId);
            if (socket) {
              socket.join(group?._id as string);
            }
          });
        }
  }
  
  
  res.json({ user });
  
  
});

// Logout user
const logoutUser = expressAsyncHandler(async (req: Request, res: Response): Promise<void> => {
  const cookieOptions: CookieOptions = {
    httpOnly: true,
    sameSite: "strict",
    maxAge: 0, // Clear cookie
    secure: process.env.NODE_ENV === "production",
  };

  res.clearCookie("accessToken", cookieOptions);
  res.json({ message: 'logged out successfully' });
});

const addContact = expressAsyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { contactNames } = req.body;

  if (!contactNames || contactNames.length === 0) {
    res.status(HttpStatusCodes.BAD_REQUEST).json({ message: "Invalid contacts" });
    return;
  }

  if (!req.user || !req.user._id) {
    res.status(HttpStatusCodes.UNAUTHORIZED).json({ message: "Unauthorized: Login to continue" });
    return;
  }

  // Fetch the logged-in user
  const loggedInUser = await User.findById(req.user._id);
  if (!loggedInUser) {
    res.status(HttpStatusCodes.NOT_FOUND).json({ error: "User not found" });
    return;
  }

  const foundContacts = await User.find({ name: { $in: contactNames } }, "_id");

  if (foundContacts.length === 0) {
    res.status(HttpStatusCodes.BAD_REQUEST).json({ message: "No valid contacts found." });
    return;
  }

  // Add contacts while avoiding duplicates
  const newContactIds: mongoose.Types.ObjectId[] = foundContacts.map((user) => user._id as mongoose.Types.ObjectId);

  // Ensure loggedInUser.contacts is an array before spreading it
  loggedInUser.contacts = [
    ...new Set([...(loggedInUser.contacts ?? []), ...newContactIds]),
  ] as mongoose.Types.ObjectId[];

  await loggedInUser.save();



  // Populate contacts before sending response
  const updatedUser = await loggedInUser.populate("contacts");

  res.status(HttpStatusCodes.OK).json({ contacts: updatedUser.contacts });
});

const getContacts = expressAsyncHandler(async (req: Request, res: Response): Promise<void> => {

   if (!req.user || !req.user._id) {
    res.status(HttpStatusCodes.UNAUTHORIZED).json({ error: "Unauthorized: Login to continue" });
    return;
  }

  const user = await User.findById(req?.user?._id).populate('contacts');

  res.json({ contacts:user?.contacts });
})

const removeContact = expressAsyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { contactId } = req.params;

  if (!contactId) {
    res.status(HttpStatusCodes.BAD_REQUEST).json({ message: "Invalid contact ID" });
    return;
  }

  if (!req.user || !req.user._id) {
    res.status(HttpStatusCodes.UNAUTHORIZED).json({ message: "Unauthorized: Login to continue" });
    return;
  }

  // Fetch the logged-in user
  const loggedInUser = await User.findById(req.user._id);
  if (!loggedInUser) {
    res.status(HttpStatusCodes.NOT_FOUND).json({ message: "User not found" });
    return;
  }

  if (!Array.isArray(loggedInUser.contacts)) {
    res.status(HttpStatusCodes.BAD_REQUEST).json({ message: "Contacts data is not available" });
    return;
  }

  // Find index of the contact
  const contactIndex = loggedInUser.contacts.findIndex((c) => c.equals(contactId));

  if (contactIndex === -1) {
    res.status(HttpStatusCodes.BAD_REQUEST).json({ message: "This contact added you OR You are not associated with that contact ID" });
    return;
  }

  // Remove the contact
  loggedInUser.contacts.splice(contactIndex, 1);

  await loggedInUser.save();

  res.status(HttpStatusCodes.OK).json({ message: "Contact removed successfully", contacts: loggedInUser.contacts });
});

const getUsersWhoAddedMe = expressAsyncHandler(async (req: Request, res: Response): Promise<void> => {
  
  if (!req?.user || !req?.user?._id) {
    res.status(HttpStatusCodes.UNAUTHORIZED).json({ message: "Unauthorized: Login to continue" });
    return;
  }
  const userId = req?.user?._id;

  const users = await User.find({ contacts: userId }).select('-password');

  res.status(HttpStatusCodes.OK).json({ users });

})

export { registerUser, loginUser, updateUser,updateUserProfile, deleteUser, logoutUser, getUserById, getAllUsers,searchUsers, addContact, getContacts, removeContact, getUsersWhoAddedMe };
