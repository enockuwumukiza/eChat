import {memo, useEffect, useState} from 'react'
import {  IconButton } from "@mui/material";
import { Check } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { setgroupMessageInfo, setReceiverInfo } from '../store/slices/messageSlice';
import { RootState } from '../store/store';
import { setGroupId } from '../store/slices/groupSlice';
import { setCurrentWindowWidth, setIsChatPageShown } from '../store/slices/displaySlice';
import { useLazyGetLastMessageQuery } from '../store/slices/messagesApiSlice';


const ContactCard = ({ user }: any) => {

  
  const dispatch = useDispatch();
  const receiverInfo: any = useSelector((state: RootState) => state.message.receiverInfo);
  const notifications: any = useSelector((state: RootState) => state.notifications.notifications);
   const isGroupChat = useSelector((state: RootState) => state.display.isGroupChat);
  const isSingleChat = useSelector((state: RootState) => state.display.isSingleChat);

  const onlineUsers = useSelector((state: RootState) => state.socket.onlineUsers);
  const currentWindowWidth = useSelector((state: RootState) => state.display.currentWindowWidth);

  const [windowWidth, setWidth] = useState(window.innerWidth);  


  const [msgNotifications, setMsgNotifications] = useState<number>(0)
  
 

  const isOnline = onlineUsers?.includes(user?._id);
  const messageNotifications = notifications.filter((not:any) => not.type === 'message_notification');

  const [triggerGetLatestMessage,{data:latestMessage, isLoading}] = useLazyGetLastMessageQuery();

  useEffect(() => {
    
    window.addEventListener('resize', () => {
      setWidth(window.innerWidth);
      dispatch(setCurrentWindowWidth(window.innerWidth));
    });
  
  

    return () => {
      window.removeEventListener('resize', () => {
        setWidth(window.innerWidth);
      }
      );
    }

    
        
  }, [windowWidth]);


  useEffect(() => {

    triggerGetLatestMessage(user?._id);

  }, [triggerGetLatestMessage, user?._id]);

  useEffect(() => {
    if (messageNotifications) {
      messageNotifications.map((noti: any) => {
        if (noti.senderId === user?._id && user?.id !== receiverInfo?._id) {
          setMsgNotifications(messageNotifications?.length)
        }
      })
    }
  }, [notifications]);
  
  
  
    return (
      <div className={`${Number(currentWindowWidth) > 1280 ? "" :"flex w-full"}`}>
        <div
        
        key={user._id}
        onClick={() => {
          if (isSingleChat && !isGroupChat) {
            dispatch(setReceiverInfo(user));
            // dispatch(setgroupMessageInfo(null));
            // dispatch(setGroupId(null));
            dispatch(setIsChatPageShown(true));
            setMsgNotifications(0);
          }
          
        }
        }
        className={`flex w-[100%] md:w-[100%] lg:w-[100%] relative justify-between gap-1 md:gap-2 lg:gap-3 py-2 pr-[1%] pl-[1%] md:pr-[7%] md:pl-[3%] lg:pr-[10%] lg:pl-[2%] md:-ml-[5%] lg:-ml-[5%] bg-gray-${!isGroupChat && isSingleChat && user?._id === receiverInfo?._id ? "950" : "900"} hover:bg-gray-700 transition-all rounded-xl shadow-md cursor-pointer `}
    >
        <div className="relative indicator w-20 h-20 md:w-24 md:h-24 -ml-4 md:-ml-1 lg:-ml-0 " >
          {
            isOnline && <span className="absolute left-[20%] top-[5%] md:left-[0%] md:top-[0%] lg:left-[0%] lg:top-[0%] indicator-item indicator-start badge badge-primary"></span>
           }
        <img
          className="w-16 h-16 ml-[15%] md:ml-[0%] lg:ml-[0%]  md:w-24 md:h-24 lg:w-32 lg:h32 rounded-full md:rounded-xl object-cover"
          src={user.profilePicture || "https://media.istockphoto.com/id/2151914146/photo/headshot-of-excited-young-man.webp?a=1&b=1&s=612x612&w=0&k=20&c=d40Yk2PnZTCBu_sCWc9jonjfOYJjrkdLvyxnp1mRK0I="}
          alt={user.name}
        />
            <span className={`absolute hidden md:flex md:top-16 left-2 bg-emerald-600 text-white text-sm md:text-xl lg:text-sm font-bold rounded px-1  `}>
          {user.name?.charAt(0) + user.name?.charAt(user.name?.indexOf(' ') + 1)}
        </span>
      </div>
      <div className="flex-1 relative">
        <div className="flex justify-between gap-2">
          <span className="absolute left-[5%] font-semibold text-white text-[16px] md:text-2xl lg:text-xl">{user?.name}</span>
          <span className="absolute -right-[35%] md:-right-[8%] lg:-right-[25%] text-gray-400 text-[10px] md:text-[16px] lg:text-[16px] pr-[14%] md:pr-[0%] ">
            {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Unknown"}
          </span>
        </div>
            <p className="absolute top-[55%] md:top-[50%] lg:top-[40%] left-[5%] text-gray-300 text:[15px] md:text[18px] lg:text-[20px] mt-2">
              {
                isLoading && <span className='italic font-bold'>Loading...</span>
              }
              {
                latestMessage && latestMessage?.latestMessage?.content ? <span className="italic text-purple-700">
                  {
                    latestMessage?.latestMessage?.content?.split('').length > 15 ? latestMessage?.latestMessage?.content?.slice(0,15) + "..." : latestMessage?.latestMessage?.content
                  }
                </span> : !isLoading && (user?.status?.split("").length > 15 ? <span className='text-teal-500 italic text-[18px]'>{user?.status.slice(0, 15)}... </span> : <span>{user?.status}</span>) 
              }
        </p>
      </div>
      <div className="flex relative  items-center gap-2">
        <div className="bg-teal-600 absolute right-[63%] md:right-[150%] lg:right-[0%] text-white font-semibold text-sm px-3 py-1 rounded-full">
            {
             msgNotifications
          }
        </div>
        <IconButton className='absolute -right-[25%] md:right-[10%] lg:-right-[80%]'>
          <Check fontSize="medium" className="text-white" />
        </IconButton>
      </div>
    </div>
      </div>
   )
}

export default memo(ContactCard)

