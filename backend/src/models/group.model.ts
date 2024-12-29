import mongoose, { Document, Schema } from "mongoose";

export interface IGroup extends Document {
    name: string;
    members: { userId: mongoose.Types.ObjectId; role: string }[];
    sender?: mongoose.Types.ObjectId,
    messages: mongoose.Types.ObjectId[];
    latestMessage?: mongoose.Types.ObjectId;
    groupAdmin?: mongoose.Types.ObjectId,

}

const groupSchema: Schema<IGroup> = new Schema({
    name: { type: String, required: true, unique: true },
    groupAdmin: { type: mongoose.Types.ObjectId, ref: "User" },
    sender:{
        type:mongoose.Types.ObjectId, ref:'User'
    },
    latestMessage: {
      type: mongoose.Types.ObjectId,
      ref: "Message",
    },


    members: [
        {
            userId: { type: mongoose.Types.ObjectId, ref: "User" },
            role: { type: String, enum: ["admin", "member"], default: "member" },
        },
    ],
    messages: [{ type: mongoose.Types.ObjectId, ref: "Message" }],
    

},{ timestamps: true });

export const Group = mongoose.model<IGroup>("Group", groupSchema);
