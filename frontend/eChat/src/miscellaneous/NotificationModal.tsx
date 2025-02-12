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
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import { clearNotifications } from "../store/slices/notificationSlice";
import { setReceiverInfo } from "../store/slices/messageSlice";

const NotificationModal: React.FC = () => {
  const dispatch = useDispatch();

  const availableUsers: any = useSelector((state: RootState) => state.users.users);

  const notifications = useSelector(
    (state: RootState) => state.notifications.notifications
  );

  const isNotificationShown = useSelector(
    (state: RootState) => state.display.isNotificationShown
  );

  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (isNotificationShown) {
      handleOpen();
    }
  }, [isNotificationShown]);

  const handleClose = () => {
    setOpen(false);
    dispatch(clearNotifications()); // Clear notifications when modal closes
  };

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
            {notifications.length === 0 ? (
              <Typography className="text-gray-500 text-center">
                No new notifications
              </Typography>
            ) : (
              notifications.map((notification) => (
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
                      {notification.type === "message_notification" && (
                        <div className="flex items-center gap-2 cursor-pointer" onClick={() => {

                          availableUsers.map((user: any) => {
                            if (user._id === notification.senderId) {
                              dispatch(setReceiverInfo(user));
                            }
                          });
                          handleClose();
                        }}>
                          <MessageIcon className="text-blue-500" />
                          {notification.content}
                        </div>
                      )}
                      {notification.type === "missed_call" && (
                        <div className="flex items-center gap-2 cursor-pointer">
                          <CallMissedIcon className="text-red-500" />
                          Missed Voice Call
                        </div>
                      )}
                      {notification.type === "missed_video" && (
                        <div className="flex items-center gap-2 cursor-pointer">
                          <VideocamOffIcon className="text-purple-500" />
                          Missed Video Call
                        </div>
                      )}
                    </Typography>
                  </div>
                </div>
              ))
            )}
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default NotificationModal;

