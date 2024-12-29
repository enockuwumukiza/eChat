import mongoose, { Document, Schema } from 'mongoose';

export interface IMessage extends Document {
    content: string | any;
    sender: mongoose.Types.ObjectId;
    chat: mongoose.Types.ObjectId; // Single chat ID (referring to either a Conversation or a Group)
    readBy: mongoose.Types.ObjectId[]; // Array of users who have read the message
    fileUrl?: string;
    chatType: string;
    receiver?: mongoose.Types.ObjectId;
    attachment?: string;
    messageType: 'text' | 'image' | 'file' | 'video' | 'audio';
    reactions: {
        user: mongoose.Types.ObjectId;
        emoji: string;
    }[];
    isDeleted: boolean;
    status: 'sent' | 'delivered' | 'read';
    isPinned: boolean;
    isLiked: boolean;
}

const messageSchema = new Schema<IMessage>(
    {
        content: {
            type: String, trim: true,
            validate: {
                validator: function (this: IMessage, value: string) {
                    if (this.messageType === 'text') {
                        return value !== null && value.trim() !== ''
                    }
                    return true
                },
                message:'content is required'
            }
        },
        sender: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
        chatType: {
        type: String,
        enum: ['Group', 'Conversation'],
        required: true,
        },
  
        chat: { type: Schema.Types.ObjectId, refPath: 'chatType'},
        readBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
        receiver:{ type: mongoose.Types.ObjectId, ref: 'User'},
        fileUrl: { 
            id: { type: String },
            url: { type: String },
            name:{ type:String },
         },
        attachment: { type: String },
        messageType: {
            type: String,
            enum: ['text', 'image', 'file', 'video', 'audio'],
            default: 'text',
        },
        reactions: [
            {
                user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
                emoji: { type: String, required: true },
            },
        ],
        isDeleted: { type: Boolean, default: false },
        isPinned: { type: Boolean, default: false },
        isLiked: { type: Boolean, default: false },
        status: {
            type: String,
            enum: ['sent', 'delivered', 'read'],
            default: 'sent',
        },
    },
    { timestamps: true }
);

messageSchema.index({ chat: 1, createdAt: -1 }); // Index to speed up message retrieval per chat

export const Message = mongoose.model<IMessage>('Message', messageSchema);
