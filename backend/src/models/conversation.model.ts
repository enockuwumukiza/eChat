import mongoose, { Schema, Document } from 'mongoose'

export interface IConversation {
    participants: mongoose.Types.ObjectId[],
    messages: mongoose.Types.ObjectId[],
    latestMessage:mongoose.Types.ObjectId
}

const conversationSchema: Schema = new Schema({

    participants: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'User'
        }
    ],
    messages: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'Message',
            default: []
        }
    ],
    latestMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
}, { timestamps: true });


export const Conversation = mongoose.model<IConversation>('Conversation', conversationSchema);