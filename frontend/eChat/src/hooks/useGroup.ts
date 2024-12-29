

import { useSocket } from './useSocket';
import { useAuth } from './useAuth';

export const useGroup = () => {
  const { socket } = useSocket();
  const { authUser } = useAuth();
 
  const handleJoinGroup = (groupId:any,groupName:string, memberNames:any[]) => {
    if (groupId && socket) {
      socket.emit('join-room', { groupId, authUserId: authUser?.user?._id, authName:authUser?.user?.name,memberNames, groupName });
      
    }
  };

  const handleLeaveGroup = (groupId:any) => {
    if (groupId && socket) {
      socket.emit('leave-room', { groupId });
      
    }
  };

  const handleSendGroupSocketMessage = (groupId:any, message:any,authName:any, groupName:string) => {
    if (groupId && message && socket) {
      socket.emit('send-room-message', { groupId, message,authName, groupName});
      
    }
  };

  return {
   
    handleJoinGroup,
    handleLeaveGroup,
    handleSendGroupSocketMessage,
 
  };
};






