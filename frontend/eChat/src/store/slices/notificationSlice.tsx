import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface INotification {
    notifications:any[]
}

const initialState: INotification = {
    
    notifications:[]
}

const notificationSlice = createSlice({
    name: 'notifications',
    initialState,
    reducers: {
        setNotifications: (state, action: PayloadAction<any[]>) => {
            state.notifications?.push(action.payload);
        }
    }
});

export const { setNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;