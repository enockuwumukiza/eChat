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

export { registerUser, loginUser, updateUser, deleteUser, logoutUser, getUserById, getAllUsers,searchUsers };
