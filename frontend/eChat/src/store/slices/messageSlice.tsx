import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IMessage {
  receiverInfo: string | null;
  groupMessageInfo: string | null;
  messages: any[]; // Messages should always be an array
  groupMessages: any[];
  displayMessages:any[]
  displayGroupMessages:any[]
}

const initialState: IMessage = {
  receiverInfo: JSON.parse(localStorage.getItem('receiverInfo') || 'null') || null,
  groupMessageInfo:JSON.parse(localStorage.getItem('groupMessageInfo') || 'null') || null,
  messages: [], // Ensure this is always initialized as an empty array,
  groupMessages: [],
  displayMessages: JSON.parse(localStorage.getItem('displayMessages') || 'null') || null,
  displayGroupMessages: JSON.parse(localStorage.getItem('displayGroupMessages') || 'null') || null,
};

const messageSlice = createSlice({
  name: 'message',
  initialState,
  reducers: {
    setReceiverInfo: (state, action: PayloadAction<string | null>) => {
      state.receiverInfo = action.payload;
      // Update localStorage, but do not rely on it for immediate updates
      localStorage.setItem('receiverInfo', JSON.stringify(action.payload));
    },

    setgroupMessageInfo: (state, action: PayloadAction<string | null>) => {
      state.groupMessageInfo = action.payload;
      localStorage.setItem('groupMessageInfo', JSON.stringify(action.payload));
    },
    setMessages: (state, action: PayloadAction<any[]>) => {
    const newMessages = action.payload.filter(
        (msg) => !state.messages.some((existing) => existing._id === msg._id)
    );
    state.messages = [...state.messages, ...newMessages];
  },
  setGroupMessages: (state, action: PayloadAction<any[]>) => {
      const newGroupMessages = action.payload.filter(
          (msg) => !state.groupMessages.some((existing) => existing._id === msg._id)
      );
      state.groupMessages = [...state.groupMessages, ...newGroupMessages];
    },
    setDisplayMessages: (state, action: PayloadAction<any[]>) => {
      state.displayMessages = action.payload;
      localStorage.setItem('displayMessages', JSON.stringify(action.payload));  // Ensure localStorage is updated immediately
    },
    setDisplayGroupMessages: (state, action: PayloadAction<any[]>) => {
      state.displayGroupMessages = action.payload;
      localStorage.setItem('displayGroupMessages', JSON.stringify(action.payload));  // Ensure localStorage is updated immediately
    }


  },
});

export const { setReceiverInfo, setMessages, setgroupMessageInfo, setGroupMessages, setDisplayMessages,setDisplayGroupMessages } = messageSlice.actions;

export default messageSlice.reducer;
