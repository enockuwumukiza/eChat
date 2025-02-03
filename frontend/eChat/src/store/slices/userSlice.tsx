import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface IUState {
    userInfo: Record<string, any> | null,
    users:any[]
}

const initialState: IUState = {
    userInfo: JSON.parse(localStorage.getItem('userInfo') || 'null') || null,
    users:[]
}

const userSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        setCredentials: (state, action: PayloadAction<any>) => {
            state.userInfo = action.payload;
            localStorage.setItem('userInfo', JSON.stringify(action.payload))
        },
        clearCredentials: (state) => {
            state.userInfo = null;
            localStorage.removeItem('userInfo')
        },
        setUsers:(state,action:PayloadAction<any>) => {
            state.users = action.payload;
        }
    }
})

export const {
    setCredentials, clearCredentials,setUsers,
} = userSlice.actions;
export default userSlice.reducer