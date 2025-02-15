import React, { useEffect, useState } from 'react';
import { AddCircle, ArrowBack, MoreVertOutlined, Search, Cancel, Forum, People, Notifications } from '@mui/icons-material';
import { Divider, IconButton, Tooltip } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { RootState } from '../store/store';
import { setIsMoreOptionsShown,setIsNotificationShown, setIsNewChatShown,setIsGroupChat, setIsSingleChat } from '../store/slices/displaySlice';
import FoundUsers from '../miscellaneous/FoundUsers';
import { useLazySearchUsersQuery } from '../store/slices/usersApiSlice';
import { useDebounce } from 'use-debounce';
import { setSearchedUsers } from '../store/slices/searchSlice';

import { setGroupId, setGroupInfo } from '../store/slices/groupSlice';
import { setReceiverInfo } from '../store/slices/messageSlice';


const Header: React.FC = () => {
    const dispatch = useDispatch();
    const [isInputFocused, setIsInputFocused] = useState<boolean>(false);
    const [searchInput, setSearchInput] = useState<string>('');

    const isNewChatShown = useSelector((state: RootState) => state.display.isNewChatShown);
    const isMoreOptionsShown = useSelector((state: RootState) => state.display.isMoreOptionsShown);
    const isChatPageShown = useSelector((state: RootState) => state.display.isChatPageShown);
    const isNotificationShown = useSelector((state: RootState) => state.display.isNotificationShown);

   
    const groupsData: any = useSelector((state: RootState) => state.group.groupData);
    const currentWindowWidth = useSelector((state: RootState) => state.display.currentWindowWidth);
    const notifications = useSelector((state: RootState) => state.notifications.notifications);
      

    const [triggerGetSearchedUsers, { data: usersFound}] = useLazySearchUsersQuery();

    // Debounce the search input value
    const [debouncedSearchInput] = useDebounce(searchInput, 200);

    // Trigger search query whenever debounced input changes
    useEffect(() => {
        if (debouncedSearchInput.trim()) {
            triggerGetSearchedUsers(debouncedSearchInput);
            
        }
    }, [debouncedSearchInput, triggerGetSearchedUsers]);

    useEffect(() => {
        if (debouncedSearchInput) {
            dispatch(setSearchedUsers(usersFound?.users));
        }
    }, [dispatch, debouncedSearchInput]);


    const handleDiplayContacts:any = () => {
        dispatch(setIsSingleChat(true));
        dispatch(setIsGroupChat(false));
        dispatch(setGroupId(null));
        dispatch(setGroupInfo(null));
      }
      const handleDisplayGroups:any = () => {
        if (groupsData?.groups) {
            dispatch(setIsGroupChat(true));
            dispatch(setIsSingleChat(false));
            dispatch(setReceiverInfo(null));
          
          }
           else if(!groupsData?.groups){
            toast.info("No groups found");
            return;
           }
    
        
    }
    
    return (
        <React.Fragment>
            <div className={`${Number(currentWindowWidth) > 1280? 'flex' : isChatPageShown ? 'hidden':'flex'}`}>
                <div className="fixed sm:left-0 md:left-48 lg:left-52 -ml-2 flex flex-col gap-3 bg-sky-900 p-5 w-[110%] md:w-[82%] lg:w-[45%] h-[22%] md:h-[20%] lg:h-[35%] shadow-lg shadow-gray-800">
                <div className="flex sm:gap-x-3 md:gap-x-40 lg:gap-x-70">
                    <h2 className="hidden md:flex lg:flex text-2xl font-bold text-white mt-[4%] ">Chats</h2>
                    <div className="flex gap-1 md:gap-3 lg:gap-10">
                        <Tooltip title="new chat">
                            <IconButton onClick={() => dispatch(setIsNewChatShown(!isNewChatShown))}>
                                <AddCircle fontSize="large" htmlColor="white" />
                            </IconButton>
                        </Tooltip>
                        <div className='md:hidden'>
                            <Tooltip title='groups'>
                                  <IconButton onClick={handleDisplayGroups}>
                                    <Forum fontSize='large' htmlColor='white'/>
                            </IconButton>
                            </Tooltip>
                        </div>
                        <div className='md:hidden'>
                             <Tooltip title='contacts'>
                            <IconButton onClick={handleDiplayContacts}>
                            <People fontSize='large' htmlColor='white'/>
                            </IconButton>
                            </Tooltip>
                       </div>
                       <Tooltip title="more options">
                            <IconButton onClick={() => dispatch(setIsMoreOptionsShown(!isMoreOptionsShown))}>
                                <MoreVertOutlined htmlColor="white" fontSize="large" />
                            </IconButton>
                        </Tooltip>
                        </div>
                        <div className='flex absolute right-[7%] md:hidden lg:hidden'>
                            <Tooltip title='notifications'>
                                <IconButton onClick={() => dispatch(setIsNotificationShown(!isNotificationShown))}>
                                    <Notifications htmlColor='white'
                                    
                                    sx={{
                                        fontSize: {
                                            xs: "30px",
                                            sm: "40px",
                                            md: "70px",
                                            lg: "35px",
                                        },
                                        }}
                                    />
                                </IconButton>
                                </Tooltip>
                                {
                                notifications.length > 0 && <div className='absolute top-[0%] left-[47%]  bg-rose-800 h-7 w-7 rounded-full'><span className="text-white font-bold p-2 text-[16px] absolute -top-2 ">{ notifications.length }</span></div>
                            }
                        </div>
                </div>
                <Divider />
                <div>
                    <div className="relative">
                        <input
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            type="text"
                            className="input input-bordered w-[95%] pl-14 rounded-xl font-semibold text-xl"
                            onFocus={() => setIsInputFocused(!isInputFocused)}
                        />
                        <IconButton
                            onClick={() => setIsInputFocused(!isInputFocused)}
                            className="absolute left-0 bottom-12 cursor-pointer"
                        >
                            {isInputFocused ? (
                                <ArrowBack fontSize="large" htmlColor="white" />
                            ) : (
                                <Search fontSize="large" htmlColor="white" />
                            )}
                        </IconButton>
                        {searchInput && (
                            <IconButton
                                onClick={() => setSearchInput('')}
                                className="absolute -right-[66%] md:-right-[78.5%] bottom-12"
                            >
                                    <Cancel
                                         sx={{
                                            fontSize: {
                                                xs: "30px",
                                                sm: "40px",
                                                md: "70px",
                                                lg: "35px",
                                            },
                                            }}
                                        htmlColor="gray" />
                            </IconButton>
                        )}
                    </div>
                </div>
            </div>
            {searchInput && <FoundUsers setSearchInput={setSearchInput} />}
            </div>
        </React.Fragment>
    );
};

export default Header;
