import { IconButton, Tooltip } from "@mui/material";
import { AddCircleOutline } from "@mui/icons-material";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { setIsAddNewContactShown } from "../store/slices/displaySlice";
import { useEffect, useState } from "react";

const NoContactsMessage = () => {

  const dispatch = useDispatch();

  const [show, setShow] = useState(false);


  useEffect(() => {

    const timerId = setTimeout(() => {

      setShow(true);

    }, 3000);
    
    return () => {
      clearTimeout(timerId);
    }
    
  }, []);

  return (
    <>
      {
        show ? <div className="flex justify-center items-center bg-gradient-to-r from-purple-950 via-pink-950 to-red-950 h-[100%] w-[100%] -left-2 ">
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
        </div> : (
            <div className="absolute left-[30%] top-30">
              <div>
                <span className="loading loading-ring loading-lg"></span>
                <motion.div
                  animate={{ y: [0, -20, 0] }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    repeatType: "loop",
                    ease: "easeInOut",
                  }}
                >
                  <p className="font-semibold text-xl">Loading, please wait...</p>
                </motion.div>
              </div>
            </div>
    )
      }
    </>
  );
};

export default NoContactsMessage;
