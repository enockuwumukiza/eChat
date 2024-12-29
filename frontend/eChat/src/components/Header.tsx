import React, { useEffect, useState } from 'react';
import { AddCircle, ArrowBack, MoreVertOutlined, Search, Cancel } from '@mui/icons-material';
import { Divider, IconButton, Tooltip } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { setIsMoreOptionsShown, setIsNewChatShown } from '../store/slices/displaySlice';
import FoundUsers from '../miscellaneous/FoundUsers';
import { useLazySearchUsersQuery } from '../store/slices/usersApiSlice';
import { useDebounce } from 'use-debounce';
import { setSearchedUsers } from '../store/slices/searchSlice';

const Header: React.FC = () => {
    const dispatch = useDispatch();
    const [isInputFocused, setIsInputFocused] = useState<boolean>(false);
    const [searchInput, setSearchInput] = useState<string>('');

    const isNewChatShown = useSelector((state: RootState) => state.display.isNewChatShown);
    const isMoreOptionsShown = useSelector((state: RootState) => state.display.isMoreOptionsShown);

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
        return <span className="loading loading-spinner loading-lg"></span>;
    }

    return (
        <React.Fragment>
            <div className="fixed left-52 -ml-2 flex flex-col gap-3 bg-sky-900 p-5 w-[45%] shadow-lg shadow-gray-800">
                <div className="flex gap-x-72">
                    <h2 className="text-2xl font-bold">Chats</h2>
                    <div className="flex gap-10">
                        <Tooltip title="new chat">
                            <IconButton onClick={() => dispatch(setIsNewChatShown(!isNewChatShown))}>
                                <AddCircle fontSize="large" htmlColor="white" />
                            </IconButton>
                        </Tooltip>
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
                            className="input input-bordered w-full pl-14 rounded-xl font-semibold text-xl"
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
                                className="absolute -right-[83%] bottom-12"
                            >
                                <Cancel fontSize="large" htmlColor="gray" />
                            </IconButton>
                        )}
                    </div>
                </div>
            </div>
            {searchInput && <FoundUsers />}
        </React.Fragment>
    );
};

export default Header;
