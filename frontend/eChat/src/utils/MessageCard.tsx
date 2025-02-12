import { useState } from "react";
import { IconButton, Menu, MenuItem } from "@mui/material";
import { MoreVert, Favorite, FavoriteBorder, PushPin, PushPinOutlined, Delete } from "@mui/icons-material";
import { useDeleteMessageMutation,useToggleLikeMessageMutation, useTogglePinMessageMutation } from "../store/slices/messagesApiSlice";
import { toast } from "react-toastify";

const MessageCard = ({msg, id,isGroupChat, isSingleChat,setDisplayGroupMessages, setDisplayMessages }: { id: any, isGroupChat:boolean, isSingleChat:boolean, setDisplayMessages:any, setDisplayGroupMessages:any, msg:any }) => {
  
  const [liked, setLiked] = useState(false);
  const [pinned, setPinned] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [isHovered, setIsHovered] = useState(false);
  
  const handleOpenMenu = (event:any) => setAnchorEl(event.currentTarget);
    const handleCloseMenu = () => setAnchorEl(null);
    
  const [deleteMessage ] = useDeleteMessageMutation();
  
  const [toggleLikeMessage] = useToggleLikeMessageMutation();
  
    const [togglePinMessage ] = useTogglePinMessageMutation();
    


    const handleDeleteMessage = async () => {
    
    try {
      await deleteMessage(id);

      if (isSingleChat) {
        setDisplayMessages((prevMessages:any) => prevMessages.filter((msg:any) => msg._id !== id));
      } else if (isGroupChat) {
        setDisplayGroupMessages((prevMessages:any) => prevMessages.filter((msg:any) => msg._id !== id));
      }

      toast.success('message deleted');

    } catch (error: any) {
      
      toast.error(error?.data?.message || error?.message || 'error deleting message')
    }
  }

   const handleLikeMessage = async () => {
      try {
        await toggleLikeMessage(id); // Assume this toggles like on the backend

        if (isSingleChat) {
          setDisplayMessages((prevMessages: any) =>
            prevMessages.map((msg: any) =>
              msg._id === id ? { ...msg, isLiked: !msg.isLiked } : msg
            )
          );
        } else if (isGroupChat) {
          setDisplayGroupMessages((prevMessages: any) =>
            prevMessages.map((msg: any) =>
              msg._id === id ? { ...msg, isLiked: !msg.isLiked } : msg
            )
          );
        }

        toast.success('Message liked');

      } catch (error: any) {
        toast.error(error?.data?.message || error?.message || 'Error liking message');
      }
  };
  
   const handlePinMessage = async () => {
      try {
        await toggleLikeMessage(id); // Assume this toggles like on the backend

        if (isSingleChat) {
          setDisplayMessages((prevMessages: any) =>
            prevMessages.map((msg: any) =>
              msg._id === id ? { ...msg, isPinned: !msg.isPinned } : msg
            )
          );
        } else if (isGroupChat) {
          setDisplayGroupMessages((prevMessages: any) =>
            prevMessages.map((msg: any) =>
              msg._id === id ? { ...msg, isPinned: !msg.isPinned } : msg
            )
          );
        }

        toast.success('Message pinned');

      } catch (error: any) {
        toast.error(error?.data?.message || error?.message || 'Error pinning message');
      }
    };


  return (
    <div className={`absolute text-white flex transition-all left-[88%] top-[20%]`}>
      

      {/* More Options Button */}
      <IconButton className="-top-1" size="small" onClick={handleOpenMenu}>
        <MoreVert className="text-yellow-500 font-extrabold" fontSize="medium" />
      </IconButton>

      {/* Dropdown Menu */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMenu}>
        <MenuItem onClick={async () => {

          await handleLikeMessage();
          
          setLiked(!liked);
          handleCloseMenu();
        }}>
          {msg?.isLiked ? <Favorite className="text-red-500 mr-2" /> : <FavoriteBorder className="mr-2" />} {msg?.isLiked ? "Unlike" : "Like"}
        </MenuItem>
        <MenuItem onClick={async () => {

          await handlePinMessage();

          setPinned(!pinned);
          handleCloseMenu();
        }}>
          {msg?.isPinned ? <PushPin className="text-yellow-500 mr-2" /> : <PushPinOutlined className="mr-2" />} {msg?.isPinned ? "Unpin" : "Pin"}
        </MenuItem>
              <MenuItem onClick={ async () => {
                   await handleDeleteMessage();
                  handleCloseMenu();
              }}>
          <Delete className="text-red-500 mr-2" /> Delete
        </MenuItem>
      </Menu>
    </div>
  );
};

export default MessageCard;
