
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../store/store'
import { setCredentials, clearCredentials } from '../store/slices/userSlice'
import { setReceiverInfo, setgroupMessageInfo } from '../store/slices/messageSlice'

export const useAuth = () => {
    const dispatch = useDispatch();
    
    const authUser = useSelector((state: RootState) => state.users.userInfo);

    const login = (data: any) => {
        dispatch(setCredentials(data));
    }
    const logout = () => {
        dispatch(clearCredentials());
        dispatch(setReceiverInfo(null));
        dispatch(setgroupMessageInfo(null));
    }

    return {
      authUser, login, logout
  }
}

