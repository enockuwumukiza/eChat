import React, { FC, useEffect } from "react";
import { Modal, Box, Typography, Button, IconButton } from "@mui/material";
import { Close, Visibility, PersonAdd } from "@mui/icons-material";
import { useAuth } from "../hooks/useAuth";
import { RootState } from "../store/store";
import { useSelector,useDispatch } from "react-redux";
import { setIsAddNewMemberShown, setIsGroupChat, setIsGroupInfoShown } from "../store/slices/displaySlice";
import { setGroupId, setGroupInfo } from "../store/slices/groupSlice";
import { useProtectGroup } from "../hooks/useProtectGroup";

const GroupOptionsModal: FC = () => {

  const { memberRole } = useProtectGroup();

  const dispatch = useDispatch();
  const isGroupOptionsShown = useSelector((state: RootState) => state.display.isGroupOptionsShown);
  const groupsData: any = useSelector((state: RootState) => state.group.groupData);
  const isGroupInfoShown = useSelector((state: RootState) => state.display.isGroupInfoShown);
  const isAddNewMemberShown = useSelector((state:RootState) => state.display.isAddNewMemberShown);
  const { authUser } = useAuth();
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    if (isGroupOptionsShown) {
      handleOpen();
    }
  }, [isGroupOptionsShown]);

  return (
    <div className="absolute">
      {authUser && (
        <IconButton className="btn btn-ghost" onClick={handleOpen}>
          <Visibility className="text-lg" />
        </IconButton>
      )}
      <Modal open={open} onClose={handleClose} className="flex items-center justify-center">
        <Box className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 flex flex-col space-y-4">
          <div className="flex justify-between items-center w-full">
            <Typography variant="h6" className="font-bold text-primary">
              <Button
                onClick={() => {
                  groupsData?.groups && dispatch(setIsGroupInfoShown(!isGroupInfoShown))
                }}
              variant="contained"
              color="primary"
              className="w-full"
            >
                Group Info
            </Button>
            </Typography>
            <Typography variant="h6" className="font-bold text-primary">
              <Button
                onClick={() => {
                  handleClose();
                  dispatch(setGroupId(null))
                  // dispatch(setIsGroupChat(false));
                  // dispatch(setGroupInfo(null));
                  
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

          {
            memberRole === 'admin' && (
              <div className="space-y-4 w-full">
            <Button
              onClick={() => dispatch(setIsAddNewMemberShown(!isAddNewMemberShown))}
              variant="contained"
              color="primary"
              startIcon={<PersonAdd />}
              className="w-full"
            >
              Add New Member
            </Button>
          </div>
            )
          }

          <Button
            variant="contained"
            color="secondary"
            onClick={handleClose}
            className="w-full"
          >
            Close
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default GroupOptionsModal;
