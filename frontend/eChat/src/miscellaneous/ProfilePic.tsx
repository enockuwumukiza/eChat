import { FC, useEffect, useState } from "react";
import { Modal, Box, IconButton, Avatar, Tooltip } from "@mui/material";
import { Close, Download } from "@mui/icons-material";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { handleDownload } from "../utils/donwloadFiles";
import { copyToClipboard } from "../utils/copyToClipboard";

const ProfilePic: FC = () => {
  const chattingUser: any = useSelector((state: RootState) => state.message.receiverInfo);
  const isReceiverPicShown = useSelector((state: RootState) => state.display.isReceiverPicShown);

  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (isReceiverPicShown) {
      setOpen(true);
    }
  }, [isReceiverPicShown]);

    const handleClose = () => setOpen(false);

  return (
    <Modal open={open} onClose={handleClose} className="flex items-center justify-center">
      <Box
        className="relative flex flex-col items-center p-6 bg-white bg-opacity-90 backdrop-blur-md shadow-xl rounded-2xl"
      >
        {/* Close Button */}
        <IconButton onClick={handleClose} className="absolute top-2 right-2 text-gray-600 hover:text-gray-900">
          <Close fontSize="large" />
        </IconButton>

        {/* Profile Picture */}
        <Avatar
          onDoubleClick={() => copyToClipboard(chattingUser?.profilePicture)}
          src={chattingUser?.profilePicture || "/default-avatar.png"}
          alt={chattingUser?.name || "User"}
          sx={{ width: 300, height: 300, borderRadius: "20px", boxShadow: "0 10px 20px rgba(0, 0, 0, 0.3)" }}
        />

        {/* Download Button */}
        <Tooltip title="Download Profile Picture">
                  <IconButton className="mt-4 text-blue-600 hover:text-blue-800 transition-all duration-300"
                    
                    onClick={() => handleDownload(chattingUser?.profilePicture,chattingUser?.name)}
                  >
                      <Download
                          sx={{
                            fontSize: {
                            xs: "30px",
                            sm: "40px",
                            md: "70px",
                            lg: "35px",
                            },
                        }}
                      />
          </IconButton>
        </Tooltip>
      </Box>
    </Modal>
  );
};

export default ProfilePic;
