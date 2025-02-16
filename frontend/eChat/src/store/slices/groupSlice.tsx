import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// State Interface
interface IGroupSlice {
    groupInfo: string | null,
    groupId: any,
    groupData: any[],
 
}

// Initial State
const initialState: IGroupSlice = {
    groupInfo: JSON.parse(localStorage.getItem('members') || 'null') || [],
    groupId: JSON.parse(localStorage.getItem('groupId') || 'null') || null,
    groupData:[]
};

// Slice Definition
const groupSlice = createSlice({
    name: "group",
    initialState,
    reducers: {
        // Set group members with proper type for the payload
        setGroupInfo: (state, action: PayloadAction<any>) => {
            state.groupInfo = action.payload;
            localStorage.setItem('members', JSON.stringify(action.payload))
        },
        setGroupId: (state, action: PayloadAction<any>) => {
            state.groupId = action.payload;
            localStorage.setItem('groupId', JSON.stringify(action.payload));
        },
        setGroupData: (state, action: PayloadAction<any[]>) => {
            state.groupData = action.payload
        }
      
    },
});

// Export Actions and Reducer
export const { setGroupInfo, setGroupId, setGroupData } = groupSlice.actions;
export default groupSlice.reducer;
