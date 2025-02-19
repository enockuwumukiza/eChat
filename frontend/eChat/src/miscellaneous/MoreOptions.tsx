import React from 'react'
import { motion } from 'framer-motion'
import { RootState } from '../store/store'
import { useSelector, useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { Settings, Logout, GroupAdd, Person, ManageAccounts } from '@mui/icons-material'
import { IconButton, CircularProgress } from '@mui/material'
import { useLogoutUserMutation } from '../store/slices/usersApiSlice'
import { useAuth } from '../hooks/useAuth'
import { setIsCreateGroupShown, setIsMoreOptionsShown, setIsSettingsShown, setIsProfileModalOpen, setIsContactsListShown } from '../store/slices/displaySlice'

const MoreOptions = () => {
  const { logout } = useAuth()
  const dispatch = useDispatch()
  const isCreateGroupShown = useSelector((state: RootState) => state.display.isCreateGroupShown);
  const isSettingsShown = useSelector((state: RootState) => state.display.isSettingsShown);
  const isProfileModalOpen = useSelector((state: RootState) => state.display.isProfileModalOpen);
  const isContactsListShown = useSelector((state: RootState) => state.display.isContactsListShown);

  const [logoutUser, { isLoading }] = useLogoutUserMutation()

  const handleLogout = async () => {
    try {
      await logoutUser(undefined)
      logout()
      dispatch(setIsMoreOptionsShown(false))
      toast.success('Logout successful')
    } catch (error: any) {
      toast.error(error?.data?.message || error?.message || 'Error logging out')
      console.log(`Error logging out: ${error}`)
    }
  }

  return (
    <React.Fragment>
      <motion.div
        className='absolute left-[27%] top-20 z-10 p-6 m-2 rounded-xl bg-slate-500 backdrop-blur-lg shadow-lg border border-gray-600 text-white'
        initial={{ y: '-100%', opacity: 0 }}
        animate={{ y: '0%', opacity: 1 }}
        exit={{ y: '-150%', opacity: 0 }}
        transition={{ type: 'tween', duration: 0.4, ease: 'easeOut' }}
      >
        <div className='flex flex-col gap-3'>
          {/* New Group Button */}
          <IconButton
            className='flex items-center gap-4 text-white font-semibold text-lg px-5 py-3 rounded-md transition duration-300 hover:bg-slate-950'
            onClick={() => {
              dispatch(setIsCreateGroupShown(!isCreateGroupShown))
              dispatch(setIsMoreOptionsShown(false))
            }}
          >
            <GroupAdd sx={{ color: 'white', fontSize: 26 }} />
            <span className='text-white'>New Group</span>
          </IconButton>

          {/* Settings Button */}
          <IconButton className='flex items-center gap-4 text-white font-semibold text-lg px-5 py-3 rounded-md transition duration-300 bg-[#10B981] hover:bg-[#059669] shadow-lg'
            
            onClick={() => dispatch(setIsSettingsShown(!isSettingsShown))}
          >
            <Settings sx={{
              color: 'white',
              fontSize: 26,
              marginLeft:"-40px"
            }} />
            <span className='text-white'>Settings</span>
          </IconButton>
          {/* Profile Button */}
          <IconButton className='flex items-center gap-4 text-white font-semibold text-lg px-5 py-3 rounded-md transition duration-300 bg-[#10B981] hover:bg-[#059669] shadow-lg'
            
            onClick={() => dispatch(setIsProfileModalOpen(!isProfileModalOpen))}>
          
            <Person sx={{
              color: 'white',
              fontSize: 30,
              marginLeft:"-50px"
            }} />
            <span className='text-white'>Profile</span>
          </IconButton>

          <IconButton className='flex items-center gap-4 text-white font-semibold text-lg px-5 py-3 rounded-md transition duration-300 bg-[#10B981] hover:bg-[#059669] shadow-lg'
            
            onClick={() => {
              dispatch(setIsMoreOptionsShown(false));
              dispatch(setIsContactsListShown(!isContactsListShown));

            }
            }>
          
            <ManageAccounts sx={{
              color: 'white',
              fontSize: 30,
              marginLeft:"-20px"
            }} />
            <span className='text-white'>Contacts</span>
          </IconButton>

          {/* Logout Button */}
          <IconButton
            onClick={handleLogout}
            className='flex items-center gap-4 text-white font-semibold text-lg px-5 py-3 rounded-md transition duration-300 bg-[#EF4444] hover:bg-[#DC2626] shadow-lg'
          >
            <Logout sx={{
              color: 'white',
              fontSize: 26,
              marginLeft:"-45px"
              
            }} />
            <span className='text-white'>Logout</span>
            {isLoading && <CircularProgress size={20} color="inherit" />}
          </IconButton>
        </div>
      </motion.div>
    </React.Fragment>
  )
}

export default MoreOptions
