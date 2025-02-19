import React from 'react';
import {
  Forum,
  Notifications,
  People,
  Settings,
  Palette,
  LogoutRounded,
  ManageAccounts

} from '@mui/icons-material';
import { toast } from 'react-toastify';
import { IconButton, Tooltip } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from '../hooks/useAuth';
import { themes } from '../utils/themes';

import { setIsGroupChat, setIsNotificationShown, setIsProfileModalOpen, setIsSettingsShown, setIsSingleChat, setIsThemesShown, setIsContactsListShown } from '../store/slices/displaySlice';
import { RootState } from '../store/store';
import { useLogoutUserMutation } from '../store/slices/usersApiSlice';


import { setGroupId, setGroupInfo } from '../store/slices/groupSlice';
import { setReceiverInfo } from '../store/slices/messageSlice';


const Sidebar: React.FC = () => {


  const dispatch = useDispatch();
  

  const isProfileModalOpen = useSelector((state: RootState) => state.display.isProfileModalOpen);
  const isNotificationShown = useSelector((state: RootState) => state.display.isNotificationShown);
  const isSettingsShown = useSelector((state: RootState) => state.display.isSettingsShown);
  const isContactsListShown = useSelector((state: RootState) => state.display.isContactsListShown);


  const notifications = useSelector((state: RootState) => state.notifications.notifications);
  const isThemesShwon = useSelector((state: RootState) => state.display.isThemesShwon);
  const theme = localStorage.getItem('theme');

  const { authUser, logout } = useAuth();

  const [logoutUser] = useLogoutUserMutation();
  

  const handleDiplayContacts:any = () => {
    dispatch(setIsSingleChat(true));
    dispatch(setIsGroupChat(false));
    dispatch(setGroupId(null));
    dispatch(setGroupInfo(null));
  }
  const handleDisplayGroups:any = () => {
    dispatch(setIsGroupChat(true));
    dispatch(setIsSingleChat(false));
    dispatch(setReceiverInfo(null));

    
  }

  const handleLogout = async () => {
    try {

      await logoutUser(undefined);
      logout();
    
    } catch (error: any) {
      toast.error(error?.data?.message || error?.message || 'error logging out');
      
    }
  }


  return (
    <div className='fixed hidden md:block lg:block bg-gray-950 text-white'
      style={{
        width: '25vw',
        maxWidth: '200px',
        height:'100vh'
    }}>
      <div className='flex flex-col gap-12 m-2'>
        <div className='flex flex-col gap-6'>
        <Tooltip title='Contacts'>
            <IconButton onClick={() => {
              dispatch(setIsContactsListShown(!isContactsListShown))
        }}>
            <ManageAccounts htmlColor='white'
              
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
        <Tooltip title='groups'>
          <IconButton onClick={handleDisplayGroups}>
              <Forum htmlColor='white'
                
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
        <Tooltip title='contacts'>
          <IconButton onClick={handleDiplayContacts}>
              <People htmlColor='white'
                
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
            notifications.length > 0 && <div className='absolute top-[40%] left-[47%]  bg-rose-800 h-7 w-7 rounded-full'><span className="text-white font-bold p-2 text-[16px] absolute -top-2 ">{ notifications.length }</span></div>
        }
      </div>
      <div className='flex flex-col gap-2'>
          <Tooltip title='account' placement='left'>
          <IconButton className='' onClick={() => dispatch(setIsProfileModalOpen(!isProfileModalOpen))}>
              <img className='w-12 h-12 rounded-full' src={authUser?.user?.profilePicture } />
          </IconButton>
        </Tooltip>
        <Tooltip title='settings' placement='left'>
          <IconButton onClick={() => dispatch(setIsSettingsShown(!isSettingsShown))}>
              <Settings htmlColor='white'
                
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
        <Tooltip title='logout' placement='left'>
          <IconButton onClick={handleLogout} >
              <LogoutRounded htmlColor='white'
                
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

           <Tooltip title={'Theme'} sx={{
                fontSize:'40px'
            }}>
            <IconButton onClick={() => dispatch(setIsThemesShown(!isThemesShwon))}>
              {
                themes?.find((t) => t?.name === theme)?.icon || <Palette />
              }
            </IconButton>
          </Tooltip>
      </div>
      </div>
    </div>
  );
};

export default Sidebar;
