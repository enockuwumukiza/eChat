
import { socketInstance } from '../socket/socketInstance';
import { useAuth } from './useAuth'


export const useSocket = () => {  

  const { authUser } = useAuth();
  
    const socket = socketInstance({ userId: authUser?.user?._id });

    return {
      socket
  }
}

