import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ITyping {
    isTyping: boolean
}

const initialState: ITyping = {
    isTyping:false
}

const typingSlice = createSlice({
    name: 'typing',
    initialState,
    reducers: {
        setIsTyping: (state, action: PayloadAction<boolean>) => {
            state.isTyping = action.payload
        }
    }
})

export const {
    setIsTyping
} = typingSlice.actions;
export default typingSlice.reducer