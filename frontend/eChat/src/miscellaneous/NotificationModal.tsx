import React, { useEffect, useState } from "react";
import {
  Modal,
  Box,
  Typography,
  IconButton,
  Avatar,
} from "@mui/material";
import MessageIcon from "@mui/icons-material/Message";
import CallMissedIcon from "@mui/icons-material/CallMissed";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import CloseIcon from "@mui/icons-material/Close";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

const NotificationModal = () => {

    const isNotificationShown = useSelector((state: RootState) => state.display.isNotificationShown);

  const [open, setOpen] = useState(false);

  const notifications = [
    {
      id: 1,
      type: "new_message",
      sender: "Alice",
      content: "Hey, are you free to chat?",
      avatar: "https://randomuser.me/api/portraits/women/1.jpg",
    },
    {
      id: 2,
      type: "missed_voice_call",
      sender: "Bob",
      avatar: "https://randomuser.me/api/portraits/men/2.jpg",
    },
    {
      id: 3,
      type: "missed_video_call",
      sender: "Charlie",
      avatar: "https://randomuser.me/api/portraits/men/3.jpg",
    },
  ];

    useEffect(() => {
        if (isNotificationShown) {
            handleOpen();
        }
    },[isNotificationShown]);

    const handleClose = () => setOpen(false);
    const handleOpen = () => setOpen(true);

  return (
    <div className="flex justify-center items-center">
     
      {/* Modal */}
      <Modal open={open} onClose={handleClose}>
        <Box
          className="bg-white rounded-lg p-5 shadow-lg"
          sx={{
            position: "absolute",
            top: "50%",
            left: "30%",
            transform: "translate(-50%, -50%)",
            width: "90%",
            maxWidth: 400,
          }}
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <Typography variant="h6" className="font-bold">
              Notifications
            </Typography>
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </div>

          {/* Notifications List */}
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className="flex items-center gap-4 p-3 bg-gray-100 rounded-lg shadow-sm"
              >
                {/* Avatar */}
                <Avatar src={notification.avatar} alt={notification.sender} />
                
                {/* Content */}
                <div className="flex-1">
                  <Typography className="font-medium">
                    {notification.sender}
                  </Typography>
                  <Typography
                    className="text-gray-500 text-sm"
                    component="div"
                  >
                    {notification.type === "new_message" && (
                      <div className="flex items-center gap-2">
                        <MessageIcon className="text-blue-500" />
                        {notification.content}
                      </div>
                    )}
                    {notification.type === "missed_voice_call" && (
                      <div className="flex items-center gap-2">
                        <CallMissedIcon className="text-red-500" />
                        Missed Voice Call
                      </div>
                    )}
                    {notification.type === "missed_video_call" && (
                      <div className="flex items-center gap-2">
                        <VideocamOffIcon className="text-purple-500" />
                        Missed Video Call
                      </div>
                    )}
                  </Typography>
                </div>
              </div>
            ))}
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default NotificationModal;
