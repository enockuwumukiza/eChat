import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ISearch {
    searchQuery: string | null;
    searchedUsers: any[],
    searchedMessages:any[]
}

const initialState: ISearch = {
    searchQuery: null,
    searchedUsers: [],
    searchedMessages:[]
}

const searchSlice = createSlice({
    name: 'search',
    initialState,
    reducers: {
        setSearchQuery: (state, action: PayloadAction<string>) => {
            state.searchQuery = action.payload;
        },
        setSearchedUsers: (state, action: PayloadAction<any[]>) => {
            if (Array.isArray(action.payload)) {
                state.searchedUsers = action.payload
            }
        },
        setSearchedMessages: (state, action: PayloadAction<any[]>) => {
            if (Array.isArray(action.payload)) {
                state.searchedMessages = action.payload
            }
        }
    }
})

export const { setSearchQuery, setSearchedMessages, setSearchedUsers } = searchSlice.actions;

export default searchSlice.reducer