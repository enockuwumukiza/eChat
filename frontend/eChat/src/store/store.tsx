import { configureStore } from '@reduxjs/toolkit'
import { apiSlice } from './slices/apiSlice'
import userSlice from './slices/userSlice'
import typingSlice from './slices/typingSlice';
// import socketSlice from './slices/socketSlice'
import messageSlice from './slices/messageSlice';
import displaySlice from './slices/displaySlice';
import groupSlice from './slices/groupSlice';
import searchSlice from './slices/searchSlice';
import notificationSlice from './slices/notificationSlice';
import socketSlice from './slices/socketSlice';
import themeSlice from './slices/themeSlice'


const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        users: userSlice,
        typing: typingSlice,
        message: messageSlice,
        display: displaySlice,
        group: groupSlice,
        search: searchSlice,
        socket:socketSlice,
        notifications:notificationSlice,
        theme:themeSlice
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware)
});

export default store;

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = ReturnType<typeof store.dispatch>