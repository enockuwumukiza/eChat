import React from 'react';
import { Divider, IconButton } from '@mui/material';
import {
  ArrowBack,
  GroupAdd,
  PersonAdd,
} from '@mui/icons-material';
import { motion } from 'framer-motion'
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { setIsCreateGroupShown, setIsMoreOptionsShown, setIsNewChatShown, setIsAddNewContactShown } from '../store/slices/displaySlice';
import { useAuth } from '../hooks/useAuth';


const NewChat = () => {

  const { authUser } = useAuth();

    const dispatch = useDispatch();
    const isCreateGroupShown = useSelector((state: RootState) => state.display.isCreateGroupShown);
    const isAddNewContactShown = useSelector((state: RootState) => state.display.isAddNewContactShown);

    const closeNewChat = () => {
        dispatch(setIsNewChatShown(false));
    }
    const openNewGroup = () => {
        dispatch(setIsNewChatShown(false));
        dispatch(setIsMoreOptionsShown(false))
        dispatch(setIsCreateGroupShown(!isCreateGroupShown));
        
    }

  return (
    <React.Fragment>
          <motion.div className="fixed lg:left-52 lg:-ml-2 flex flex-col lg:gap-6 bg-sky-900 p-6 z-50 w-[100%] md:w-[100%] lg:w-[43.2%] shadow-xl shadow-gray-800 text-white h-full"
            
              initial={{ x: '-130%' }}
              animate={{ x: '0%' }}
              exit={{ x: '-180%' }}
              transition={{type:'spring', stiffness:100, damping:20}}
      >
        {/* Header */}
              <div className="flex items-center gap-4"
                 
              >
          <IconButton className="hover:bg-sky-800 transition-all" onClick={closeNewChat}>
            <ArrowBack fontSize="large" htmlColor="white" />
          </IconButton>
          <p className="text-2xl md:text-3xl lg:text-xl font-semibold">New Chat</p>
        </div>
  

        {/* Options */}
        <div className="flex flex-col gap-4 mt-4">
          {/* New Group */}
          <div className="flex items-center gap-4 p-3 hover:bg-sky-800 rounded-lg transition-all cursor-pointer" onClick={openNewGroup}>
            <div className="bg-teal-600 p-3 rounded-full"  >
              <GroupAdd fontSize="large" htmlColor="white" />
            </div>
            <span className="text-2xl md:text-3xl lg:text-xl font-semibold">New Group</span>
          </div>
          <Divider className="border-gray-600" />

          {/* New Contact */}
          <div className="flex items-center gap-4 p-3 hover:bg-sky-800 rounded-lg transition-all cursor-pointer" onClick={() => dispatch(setIsAddNewContactShown(!isAddNewContactShown))}>
            <div className="bg-teal-600 p-3 rounded-full" >
              <PersonAdd fontSize="large" htmlColor="white" />
            </div>
            <span className="text-2xl md:text-3xl lg:text-xl font-semibold">New Contact</span>
          </div>
          <Divider className="border-gray-600" />
        </div>

        {/* User Info */}
        <div className="flex items-center gap-4 mt-6">
          <img
            className="w-14 h-14 rounded-full object-cover"
            src={ authUser?.user?.profilePicture || `https://media.istockphoto.com/id/1581299863/de/foto/mann-arbeitet-am-computer-in-gro%C3%9Fem-fabriklager.jpg?s=612x612&w=0&k=20&c=FOSh7Fomsv2U3qiWgRMILas6xY1xrOmilzTO7aYCz_w=`}
            alt="Profile"
          />
          <span className="text-2xl md:text-3xl lg:text-xl font-semibold">{ authUser?.user?.name }</span>
        </div>
      </motion.div>
    </React.Fragment>
  );
};

export default NewChat;
