import { useSocket } from "./useSocket";
import { v4 as uuidv4 } from "uuid";
import { useEffect } from 'react'
import { useDispatch } from "react-redux";
import { addNotification } from "../store/slices/notificationSlice";

export const useListenNotifications = () => {

    const dispatch = useDispatch();
    const { socket } = useSocket();
    
    useEffect(() => {
        if (socket) {
            socket.connect();

            socket?.on("message-notification", (data: any) => {

                dispatch(
                    addNotification({
                        id: uuidv4(),
                        type: "message_notification",
                        sender: data?.receiver?.name,
                        senderId: data?.sender,
                        content: data?.message,
                        avatar: data?.receiver?.photo || "https://randomuser.me/api/portraits/women/1.jpg",
                        timestamp: new Date().toISOString(),
                    })
                );
            });

            socket.on('missed_call', (data: any) => {
                dispatch(
                    addNotification({
                        id: uuidv4(),
                        type: "missed_call",
                        sender: data?.sender?.name,
                        avatar: data?.sender?.photo || "https://randomuser.me/api/portraits/men/2.jpg",
                        timestamp: new Date().toISOString(),
                    })
                );
            });

            socket.on('missed_v_call', (data: any) => {
                dispatch(
                  addNotification({
                    id: uuidv4(),
                    type: "missed_video",
                    sender: data?.sender?.name,
                    avatar: data?.sender?.photo || "https://randomuser.me/api/portraits/men/2.jpg",
                    timestamp: new Date().toISOString(),
                  })
                );
            })
        }
        
    }, []);

    return null;
}


