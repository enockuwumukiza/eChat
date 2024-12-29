import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface ISocketSlice {
    onlineUsers:any[]
}

const initialState: ISocketSlice = {
    onlineUsers:[]
}

const socketSlice = createSlice({
    name: 'socket',
    initialState,
    reducers: {
        setOnlineUsers: (state, action: PayloadAction<any[]>) => {
            state.onlineUsers = action.payload;
        }
    }
});

export const { setOnlineUsers } = socketSlice.actions;
export default socketSlice.reducer