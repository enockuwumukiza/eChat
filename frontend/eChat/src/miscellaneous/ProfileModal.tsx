import React, { FC, useEffect } from "react";
import { Modal, Box, Typography, Button, IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";
import { useAuth } from "../hooks/useAuth";
import { RootState } from "../store/store";
import { useSelector } from "react-redux";



const ProfileModal: FC = () => {

    const isProfileModalOpen = useSelector((state: RootState) => state.display.isProfileModalOpen);

    const { authUser } = useAuth();
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    useEffect(() => {
        if (isProfileModalOpen) {
            handleOpen();
        }
    },[isProfileModalOpen])
    

  return (
    <>
          <div className="absolute">
      <Modal open={open} onClose={handleClose} className="flex items-center justify-center">
        <Box
          className="bg-white rounded-lg shadow-lg w-96 p-6 flex flex-col items-center space-y-4"
        >
          <div className="w-full flex justify-between items-center">
              <Typography variant="h5" className="font-bold text-sky-500">
              {authUser?.user?.name}
            </Typography>
            <IconButton onClick={handleClose} className="text-gray-500">
              <Close />
            </IconButton>
          </div>
          <img
            src={authUser?.user?.profilePicture}
            alt={authUser?.user?.name}
            className="w-36 h-36 rounded-full shadow-md"
                      />
            <Typography className="text-lg text-sky-500">
            Phone: +{authUser?.user?.phone}
          </Typography>
          <Typography className="text-lg text-sky-500">
            Email: {authUser?.user?.email}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleClose}
            className="mt-4"
          >
            Close
          </Button>
        </Box>
      </Modal>
      </div>
    </>
  );
};

export default ProfileModal;
