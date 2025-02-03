import React, { useEffect, useState } from 'react';
import { AddCircle, ArrowBack, MoreVertOutlined, Search, Cancel, Forum, People } from '@mui/icons-material';
import { Divider, IconButton, Tooltip } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { RootState } from '../store/store';
import { setIsMoreOptionsShown, setIsNewChatShown,setIsGroupChat, setIsSingleChat } from '../store/slices/displaySlice';
import FoundUsers from '../miscellaneous/FoundUsers';
import { useLazySearchUsersQuery } from '../store/slices/usersApiSlice';
import { useDebounce } from 'use-debounce';
import { setSearchedUsers } from '../store/slices/searchSlice';

import { setGroupId, setGroupInfo } from '../store/slices/groupSlice';
import { setReceiverInfo } from '../store/slices/messageSlice';


const SimpleHeader: React.FC = () => {
    const dispatch = useDispatch();
    const [isInputFocused, setIsInputFocused] = useState<boolean>(false);
    const [searchInput, setSearchInput] = useState<string>('');

    const isNewChatShown = useSelector((state: RootState) => state.display.isNewChatShown);
    const isMoreOptionsShown = useSelector((state: RootState) => state.display.isMoreOptionsShown);
    const isChatPageShown = useSelector((state: RootState) => state.display.isChatPageShown);

   
    const groupsData: any = useSelector((state: RootState) => state.group.groupData);
    const currentWindowWidth = useSelector((state: RootState) => state.display.currentWindowWidth);
      

    const [triggerGetSearchedUsers, { data: usersFound, isLoading }] = useLazySearchUsersQuery();

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


    if (isLoading) {
        return <div className='absolute left-[50%] top-[50%]'><span className="loading loading-spinner loading-lg"></span>;</div>
    }

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
            <div>
                <div className="fixed right-0 flex flex-col gap-3 bg-sky-900 p-5 w-full  sm:w-[110%] md:w-[75%] lg:w-[45%] shadow-lg shadow-gray-800">
                <div className="flex gap-x-8 md:gap-x-40 lg:gap-x-70">
                    <h2 className="text-2xl font-bold">Chats</h2>
                    <div className="flex gap-3 lg:gap-10">
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
                                className="absolute -right-[70%] md:-right-[78.5%] bottom-12"
                            >
                                <Cancel fontSize="large" htmlColor="gray" />
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

export default SimpleHeader;
