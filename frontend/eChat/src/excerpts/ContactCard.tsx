import {memo} from 'react'
import {  IconButton } from "@mui/material";
import { Check } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { setgroupMessageInfo, setReceiverInfo } from '../store/slices/messageSlice';
import { RootState } from '../store/store';
import { setGroupId } from '../store/slices/groupSlice';
import { setIsSingleMessageLoading } from '../store/slices/displaySlice';
const ContactCard = ({ user }: any) => {
  
  const dispatch = useDispatch();
  const receiverInfo: any = useSelector((state: RootState) => state.message.receiverInfo);
  const notifications: any = useSelector((state: RootState) => state.notifications.notifications);
   const isGroupChat = useSelector((state: RootState) => state.display.isGroupChat);
  const isSingleChat = useSelector((state: RootState) => state.display.isSingleChat);

  const onlineUsers = useSelector((state: RootState) => state.socket.onlineUsers);

  
 

  const isOnline = onlineUsers?.includes(user?._id);
  const notificationsLength = notifications?.length

  
  
    return (
      <div
        
        key={user._id}
        onClick={() => {
          if (isSingleChat && !isGroupChat) {
            dispatch(setReceiverInfo(user));
            dispatch(setgroupMessageInfo(null));
            dispatch(setGroupId(null));
          }
          
        }
        }
        className={`flex gap-5 bg-gray-${!isGroupChat && isSingleChat && user?._id === receiverInfo?._id ? "950" : "900"} hover:bg-gray-700 transition-all rounded-xl shadow-md p-4 cursor-pointer `}
    >
        <div className="relative indicator" >
          {
            isOnline && <span className="indicator-item indicator-start badge badge-primary"></span>
           }
        <img
          className="w-24 h-24 rounded-xl object-cover"
          src={user.profilePicture || "https://via.placeholder.com/150"}
          alt={user.name}
        />
        <span className="absolute top-2 left-2 bg-emerald-600 text-white text-sm font-bold rounded px-1">
          {user.name?.charAt(0) + user.name?.charAt(user.name?.indexOf(' ') + 1)}
        </span>
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-white text-lg">{user?.name}</h2>
          <span className="text-gray-400 text-sm">
            {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Unknown"}
          </span>
        </div>
        <p className="text-gray-300 text-sm mt-2">{user.status || "No status"}</p>
      </div>
      <div className="flex items-center gap-2">
        <div className="bg-teal-600 text-white font-semibold text-sm px-3 py-1 rounded-full">
            {
             notificationsLength
          }
        </div>
        <IconButton>
          <Check fontSize="medium" className="text-white" />
        </IconButton>
      </div>
    </div>
   )
}

export default memo(ContactCard)
