import { createSlice,  PayloadAction } from "@reduxjs/toolkit";

interface IDisplaySlice {
    isGroupChat: boolean,
    isSingleChat: boolean,
    isProfileModalOpen: boolean,
    isNewChatShown: boolean,
    isCreateGroupShown: boolean,
    isMoreOptionsShown: boolean,
    isGroupInfoShown: boolean,
    isGroupOptionsShown: boolean,
    isUserInfoShown: boolean,
    isReceiverPicShown: boolean,
    isAddNewMemberShown: boolean,
    isNotificationShown:boolean,
    isSingleMessageLoading: boolean,
    isAudioCallEnabled: boolean,
    isChatPageShown: boolean,
    callerData: any,
    isVideoCallEnabled: boolean,
    currentWindowWidth: number,
    isSettingsShown: boolean,
    isThemesShwon: boolean,
    isAddNewContactShown: boolean,
    isContactsListShown:boolean,
}

const initialState: IDisplaySlice = {
    isGroupChat: false,
    isSingleChat: JSON.parse(localStorage.getItem('isSingleChat') || 'true') || true,
    isProfileModalOpen: false,
    isNewChatShown: false,
    isCreateGroupShown: false,
    isMoreOptionsShown: false,
    isGroupInfoShown: false,
    isGroupOptionsShown: false,
    isUserInfoShown: false,
    isAddNewMemberShown: false,
    isSingleMessageLoading: false,
    isAudioCallEnabled: false,
    callerData: [],
    isVideoCallEnabled:false,
    isNotificationShown: false,
    currentWindowWidth: window.innerWidth,
    isChatPageShown: JSON.parse(localStorage.getItem('chatState') || 'true') || window.innerWidth > 1280 ? true : false,
    isSettingsShown: false,
    isThemesShwon: false,
    isReceiverPicShown: false,
    isAddNewContactShown: false,
    isContactsListShown:false,
}


const displaySlice = createSlice({
    name: 'display',
    initialState,
    reducers: {
        setIsGroupChat: (state, action: PayloadAction<boolean>) => {
            state.isGroupChat = action.payload;
            
        },
        setIsSingleChat: (state, action: PayloadAction<boolean>) => {
            state.isSingleChat = action.payload;
            localStorage.setItem('isSingleChat', JSON.stringify(action.payload));
        },
        setIsProfileModalOpen: (state, action: PayloadAction<boolean>) => {
            state.isProfileModalOpen = action.payload
        },
        setIsAddNewContactShown: (state, action: PayloadAction<boolean>) => {
            state.isAddNewContactShown = action.payload
        },
        setIsNotificationShown: (state, action: PayloadAction<boolean>) => {
            state.isNotificationShown = action.payload
        },
        setIsContactsListShown: (state, action: PayloadAction<boolean>) => {
            state.isContactsListShown = action.payload
        },
        setIsGroupInfoShown: (state, action: PayloadAction<boolean>) => {
            state.isGroupInfoShown = action.payload
        },
        setIsNewChatShown: (state, action: PayloadAction<boolean>) => {
            state.isNewChatShown = action.payload
        },
        setIsCreateGroupShown: (state, action: PayloadAction<boolean>) => {
            state.isCreateGroupShown = action.payload
        },
        setIsMoreOptionsShown: (state, action: PayloadAction<boolean>) => {
            state.isMoreOptionsShown = action.payload
        },
        setIsGroupOptionsShown: (state, action: PayloadAction<boolean>) => {
            state.isGroupOptionsShown = action.payload
        },
        setIsUserInfoShown: (state, action: PayloadAction<boolean>) => {
            state.isUserInfoShown = action.payload
        },
        setIsReceiverPicShown: (state, action: PayloadAction<boolean>) => {
            state.isReceiverPicShown = action.payload
        },
        setIsAddNewMemberShown: (state, action: PayloadAction<boolean>) => {
            state.isAddNewMemberShown = action.payload
        },
        setIsSingleMessageLoading: (state, action: PayloadAction<boolean>) => {
            state.isSingleMessageLoading = action.payload
        },
        setIsAudioCallEnabled: (state, action: PayloadAction<boolean>) => {
            state.isAudioCallEnabled = action.payload;
        },
        setCallerData: (state, action: PayloadAction<any>) => {  
            state.callerData = action.payload;
        },
        setIsVideoCallEnabled:(state, action:PayloadAction<boolean>) =>{
            state.isVideoCallEnabled = action.payload;
        },
        setCurrentWindowWidth: (state, action: PayloadAction<number>) => {
            {
                state.currentWindowWidth = action.payload;
            }
        },
        setIsChatPageShown: (state, action: PayloadAction<boolean>) => {
            {
                state.isChatPageShown = action.payload;
                localStorage.setItem('chatState', JSON.stringify(action.payload));
            }
        },
        setIsSettingsShown: (state, action: PayloadAction<boolean>) => {
            state.isSettingsShown = action.payload
        },
        setIsThemesShown: (state, action: PayloadAction<boolean>) => {
            state.isThemesShwon = action.payload
        }
    }
})

export const { setIsGroupChat, setIsSingleChat, setIsProfileModalOpen, setIsNewChatShown, setIsCreateGroupShown, setIsMoreOptionsShown, setIsGroupInfoShown,setIsGroupOptionsShown, setIsUserInfoShown,setIsAddNewMemberShown,setIsNotificationShown, setIsSingleMessageLoading, setIsAudioCallEnabled, setCallerData,setIsVideoCallEnabled, setCurrentWindowWidth, setIsChatPageShown, setIsSettingsShown, setIsThemesShown,setIsReceiverPicShown,setIsAddNewContactShown, setIsContactsListShown } = displaySlice.actions;
export default displaySlice.reducer;