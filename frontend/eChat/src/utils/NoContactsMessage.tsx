import { IconButton, Tooltip } from "@mui/material";
import { AddCircleOutline } from "@mui/icons-material";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { setIsAddNewContactShown } from "../store/slices/displaySlice";

const NoContactsMessage = () => {

  const dispatch = useDispatch();

  return (
    <div className="flex justify-center items-center bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 h-[100%] w-[100%] -left-2 ">
      <motion.div
        className="text-center text-white rounded-xl shadow-lg bg-opacity-60"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <p className="text-3xl font-semibold mb-4 text-sky-300">No Contacts</p>
        <p className="text-lg mb-6 font-bold italic">
          Please, search for contacts to add and start chatting.
        </p>
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <Tooltip title="search contacts" placement="right" sx={{
            fontSize: {
              xs: '16px',
              sm: '20px',
              md: '25px',
              lg:'30px'
            }
          }}>
            <IconButton
            className="text-white text-3xl hover:bg-white hover:bg-opacity-20 p-4"
              aria-label="Add Contact"
            onClick={() => dispatch(setIsAddNewContactShown(true))}
          >
            <AddCircleOutline sx={{
              color:'white',
              fontSize: {
                xs: '30px',
                sm: '50px',
                md: '60px',
                lg:'50px'
              }
            }} />
          </IconButton>
          </Tooltip>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NoContactsMessage;
