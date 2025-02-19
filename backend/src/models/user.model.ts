import mongoose, { CallbackError, Document, Schema } from "mongoose";
import bcrypt from "bcrypt";
import Joi from "joi";
import PasswordComplexity from "joi-password-complexity";

export interface IUser extends Document {
  name: string;
  email: string;
  phone: string;
  password: string;
  profilePicture?: string;
  status: string;
  lastSeen?: Date;
  chats?: mongoose.Types.ObjectId[];
  isAdmin: boolean;
  contacts?: mongoose.Types.ObjectId[];
}

// Mongoose schema
const userSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      index: true,
    },
    email: {
      type: String,
      index:true,
      required: [true, "Email is required"],
      unique: true,
      match: [
        /^\S+@\S+\.\S+$/,
        "Please provide a valid email address",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 8,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      match: [/^\d{10,15}$/, "Please provide a valid phone number"],
      unique:true
    },
    status: {
      type: String,
      default: "Hey there! I am using eChat",
    },
    about: {
      type: String,
      enum: ['active', 'inactive'],
      default:'active'
    },
    profilePicture: {
      type: String,
      default: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    },
    contacts:[
      {
        type:mongoose.Schema.Types.ObjectId, ref:'User'
      }
    ],
    chats: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
    ],
  },
  { timestamps: true }
);

// Password hashing middleware
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password as string, salt);
    next();
  } catch (error) {
    next(error as CallbackError);
  }
});

// Joi validation schema
export const validateUser = (user: Partial<IUser>) => {
  const complexityOptions = {
    min: 8,
    max: 30,
    lowerCase: 1,
    upperCase: 1,
    numeric: 1,
    symbol: 1,
  };

  const schema = Joi.object({
    name: Joi.string().required().trim(),
    email: Joi.string().email().required(),
    phone: Joi.string().pattern(/^\d{10,15}$/).required(),
    password: PasswordComplexity(complexityOptions).required(),
    isAdmin:Joi.boolean(),
    profilePicture: Joi.string().uri(),
  });

  return schema.validate(user);
};

export const User = mongoose.model<IUser>("User", userSchema);
