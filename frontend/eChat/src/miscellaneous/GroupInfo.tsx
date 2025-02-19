import React, { FC, useEffect } from "react";
import { Modal, Box, Typography, Button, IconButton, Divider } from "@mui/material";
import { Close } from "@mui/icons-material";
import { useAuth } from "../hooks/useAuth";
import { RootState } from "../store/store";
import { useSelector,useDispatch } from "react-redux";
import { useLazyGetGroupByIdQuery, useRemoveGroupMemberMutation } from "../store/slices/groupApiSlice";
import { toast} from "react-toastify";
import { setIsGroupInfoShown } from "../store/slices/displaySlice";
import { useProtectGroup } from "../hooks/useProtectGroup";

const GroupInfo: FC = () => {
  const { memberRole } = useProtectGroup();

  const dispatch = useDispatch();
  const isGroupInfoShown = useSelector((state: RootState) => state.display.isGroupInfoShown);
  const groupId = useSelector((state: RootState) => state.group.groupId);

  
  

  const [triggerGetGroupById, { data: groupData }] = useLazyGetGroupByIdQuery();
  const [removeGroupMember, { isLoading }] = useRemoveGroupMemberMutation();

  const { authUser } = useAuth();
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    if (groupId) {
      triggerGetGroupById(groupId);
    }
  }, [triggerGetGroupById, groupId]);

  useEffect(() => {
    if (isGroupInfoShown) {
      handleOpen();
    }
  }, [isGroupInfoShown]);


  const handleRemoveGroupMember = async (memberName:any) => {
    try {
      await removeGroupMember({ groupId,  memberName }).unwrap();
      dispatch(setIsGroupInfoShown(false));
      setOpen(false);

    } catch (error:any) {
      toast.error(error?.data?.message || error?.message || 'Error removing member');
    }
  }

  return (
    <div className="fixed">
      <Modal
        open={open}
        onClose={handleClose}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 2,
        }}
      >
        <Box
          sx={{
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 3,
            width: {
              xs:'100%',
              sm: '100%',
              md: '100%',
              lg:'60%'
            },

            p: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            overflowY: "auto",
            maxHeight: "90vh",
          }}
        >
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: "bold", color: "primary.main" }}>
              {groupData?.group?.name || "Group Info"}
            </Typography>
            <IconButton onClick={handleClose}>
              <Close />
            </IconButton>
          </div>
          <Divider sx={{ width: "100%", my: 2 }} />
          <img
            src={authUser?.user?.profilePicture || "/default-avatar.png"}
            alt={authUser?.user?.name || "User"}
            style={{
              width: 150,
              height: 150,
              borderRadius: "50%",
              boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
              objectFit: "cover",
            }}
          />
          <Typography variant="subtitle1" sx={{ mt: 2, color: "text.secondary" }}>
            Group Admin: <strong>{groupData?.group?.groupAdmin?.name || "N/A"}</strong>
          </Typography>
          <Divider sx={{ width: "100%", my: 2 }} />
          <Typography variant="h6" sx={{ fontWeight: "bold", color: "text.primary", margin:'0px 30px' }}>
            Group Members: {groupData?.group?.members?.length -1  || 0}  + <span className="font-semibold text-sky-200">Admin</span>
          </Typography>
          <div
            style={{
              marginTop: 16,
              width: "100%",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: 16,
            }}
          >
            {groupData?.group?.members?.filter((m:any) => m?.role !== 'admin').map((member: any) => (
              <div
                key={member?.userId?._id}
                style={{
                  padding: 16,
                  border: "1px solid #e0e0e0",
                  borderRadius: 8,
                  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                }}
              >
                <Typography variant="body2" sx={{ color: "text.primary" }}>
                  <strong>Name:</strong> {member?.userId?.name || "N/A"}
                </Typography>
                <Typography variant="body2" sx={{ color: "text.primary" }}>
                  <strong>Email:</strong> {member?.userId?.email || "N/A"}
                </Typography>
                <Typography variant="body2" sx={{ color: "text.primary" }}>
                  <strong>Phone:</strong> +{member?.userId?.phone || "N/A"}
                </Typography>

                {
                  memberRole === 'admin' && (
                    <Button
                  variant="contained"
                  color="warning"
                  onClick={() => handleRemoveGroupMember(member?.userId?.name)}
                  sx={{ mt: 2, alignSelf: "center" , width:'100px'}}
                >
                  { isLoading ? "Removing..." : "Remove"}
                </Button>
                  )
                }
              </div>
            ))}
          </div>
          <Button
            variant="contained"
            color="primary"
            onClick={handleClose}
            sx={{ mt: 3, alignSelf: "center" }}
          >
            Close
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default GroupInfo;
