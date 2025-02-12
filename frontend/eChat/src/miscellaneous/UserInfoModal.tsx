import React, { FC } from "react";
import { Modal, Box, Typography, IconButton, Avatar, Divider, Button } from "@mui/material";
import { Close } from "@mui/icons-material";
import { useSelector,useDispatch } from "react-redux";
import { RootState } from "../store/store";
import { setReceiverInfo } from "../store/slices/messageSlice";
const UserInfoModal: FC = () => {

  const dispatch = useDispatch();
  const isUserInfoShown = useSelector((state: RootState) => state.display.isUserInfoShown);
  const chattingUser:any = useSelector((state: RootState) => state.message.receiverInfo);
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  React.useEffect(() => {
    if (isUserInfoShown) {
      handleOpen();
    }
  }, [isUserInfoShown]);

  return (
    <Modal open={open} onClose={handleClose} className="flex items-center justify-center">
      <Box
        className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 flex flex-col space-y-4"
        sx={{ bgcolor: "background.paper", boxShadow: 3 }}
      >
        <div className="flex justify-between items-center w-full">
          <Typography variant="h6" className="font-bold text-primary">
            User Info
          </Typography>
          <Typography variant="h6" className="font-bold text-primary">
            <Button
              onClick={() => {
                handleClose();
                // dispatch(setIsSingleChat(false));
                // dispatch(setIsGroupChat(false));
                dispatch(setReceiverInfo(null));
                
              }}
            variant="contained"
            color="primary"
            className="w-full"
          >
              Close Chat
          </Button>
          </Typography>
          <IconButton onClick={handleClose}>
            <Close />
          </IconButton>
        </div>

        <Divider className="my-4" />

        <div className="flex flex-col items-center space-y-4">
          <Avatar
            src={chattingUser?.profilePicture || "/default-avatar.png"}
            alt={chattingUser?.name || "User"}
            sx={{ width: 100, height: 100 }}
          />
          <Typography variant="h6" className="font-bold text-gray-700">
            {chattingUser?.name || "Unknown User"}
          </Typography>
          <Typography variant="body1" className="text-gray-500">
            <strong>Email:</strong> {chattingUser?.email || "N/A"}
          </Typography>
          <Typography variant="body1" className="text-gray-500">
            <strong>Status:</strong> {chattingUser?.status || "Offline"}
          </Typography>
        </div>

        <Button
          variant="contained"
          color="secondary"
          className="w-full"
          onClick={handleClose}
        >
          Close
        </Button>
      </Box>
    </Modal>
  );
};

export default UserInfoModal;
