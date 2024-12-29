import React from 'react'
import { motion } from 'framer-motion'
import { RootState } from '../store/store'
import { useSelector, useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { useLogoutUserMutation } from '../store/slices/usersApiSlice'
import { useAuth } from '../hooks/useAuth'
import { setIsCreateGroupShown, setIsMoreOptionsShown } from '../store/slices/displaySlice'

const MoreOptions = () => {

  const { logout } = useAuth();

  const dispatch = useDispatch();

  const isCreateGroupShown = useSelector((state: RootState) => state.display.isCreateGroupShown);


  const [logoutUser, { isLoading }] = useLogoutUserMutation();
  
  const handleLogout = async () => {
    try {

      await logoutUser(undefined);
      logout();
      dispatch(setIsMoreOptionsShown(false));
      toast.success('logout succesful');

    } catch (error: any) {
      toast.error(error?.data?.message || error?.message || 'error logging out');
      console.log(`Error logging out: ${error}`)
    }
  }


  return (
    <React.Fragment>
      <motion.div className='absolute bg-slate-950 left-[27%] top-20 z-10 p-10 m-2 rounded-lg'
        
        initial={{ y: '-100%' }}
        animate={{ y: '0%' }}
        exit={{ y: '-190%' }}
        transition={{type:'tween', stiffness:'80', damping:'20'}}
      
      >
        <div className=''>
          <div className='font-bold text-xl p-2 cursor-pointer hover:bg-slate-800 rounded-sm'
          
            onClick={() => {
              dispatch(setIsCreateGroupShown(!isCreateGroupShown));
              dispatch(setIsMoreOptionsShown(false))
              
            }}
          >
            New Group
          </div>
          <div className='font-bold text-xl p-2 cursor-pointer hover:bg-slate-800 rounded-sm'>
            Selected Chats
          </div>
          <div
            onClick={handleLogout}
            className='font-bold text-xl p-2 cursor-pointer hover:bg-slate-800 rounded-sm'>
            Logout
            {
              isLoading && <span className='loading loading-spinner loading-lg'></span>
            }
          </div>
        </div>
        
      </motion.div>
    </React.Fragment>
  )
}

export default MoreOptions
