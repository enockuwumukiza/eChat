import React from 'react';
import {
  Chat,
  Forum,
  Notifications,
  People,
  Settings,
 
  LogoutRounded
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import { IconButton, Tooltip } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from '../hooks/useAuth';
import { setIsGroupChat, setIsProfileModalOpen, setIsSingleChat } from '../store/slices/displaySlice';
import { RootState } from '../store/store';
import { useLogoutUserMutation } from '../store/slices/usersApiSlice';


import { setGroupId, setGroupInfo } from '../store/slices/groupSlice';
import { setReceiverInfo } from '../store/slices/messageSlice';

const Sidebar: React.FC = () => {


  const dispatch = useDispatch();
  

  const isProfileModalOpen = useSelector((state: RootState) => state.display.isProfileModalOpen);
  const groupsData:any = useSelector((state: RootState) => state.group.groupData);

  const { authUser, logout } = useAuth();

  const [ logoutUser] = useLogoutUserMutation();

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

  const handleLogout = async () => {
    try {

      await logoutUser(undefined);
      logout();
      toast.success('logout succesful');

    } catch (error: any) {
      toast.error(error?.data?.message || error?.message || 'error logging out');
      console.log(`Error logging out: ${error}`)
    }
  }

  return (
    <div className='fixed bg-gray-950 text-white'
      style={{
        width: '25vw',
        maxWidth: '200px',
        height:'100vh'
    }}>
      <div className='flex flex-col gap-28 m-2'>
        <div className='flex flex-col gap-10'>
        <Tooltip title='messages'>
          <IconButton>
            <Chat fontSize='large' htmlColor='white'/>
          </IconButton>
        </Tooltip>
        <Tooltip title='groups'>
          <IconButton onClick={handleDisplayGroups}>
            <Forum fontSize='large' htmlColor='white'/>
          </IconButton>
          </Tooltip>
        <Tooltip title='contacts'>
          <IconButton onClick={handleDiplayContacts}>
            <People fontSize='large' htmlColor='white'/>
          </IconButton>
          </Tooltip>
        <Tooltip title='notifications'>
          <IconButton>
            <Notifications fontSize='large' htmlColor='white'/>
          </IconButton>
          </Tooltip>
        
      </div>
      <div className='flex flex-col gap-3'>
          <Tooltip title='account' placement='left'>
          <IconButton className='' onClick={() => dispatch(setIsProfileModalOpen(!isProfileModalOpen))}>
              <img className='w-12 h-12 rounded-full' src={authUser?.user?.profilePicture } />
          </IconButton>
        </Tooltip>
        <Tooltip title='settings' placement='left'>
          <IconButton>
            <Settings fontSize='large' htmlColor='white'/>
          </IconButton>
          </Tooltip>
        <Tooltip title='logout' placement='left'>
          <IconButton onClick={handleLogout} >
            <LogoutRounded fontSize='large' htmlColor='white'/>
          </IconButton>
          </Tooltip>
      </div>
      </div>
    </div>
  );
};

export default Sidebar;
