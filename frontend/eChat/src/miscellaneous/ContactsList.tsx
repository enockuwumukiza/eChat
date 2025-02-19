import React from "react";
import { motion} from "framer-motion";
import { IconButton, Avatar } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import VerifiedIcon from "@mui/icons-material/Verified";
import CancelIcon from "@mui/icons-material/Cancel";
import { toast } from "react-toastify";
import { setUserContacts } from "../store/slices/userSlice";


import { useRemoveContactMutation } from "../store/slices/usersApiSlice";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";


const ContactsList: React.FC<any> = ({ setAllContacts, allContacts}:{setAllContacts:any, allContacts:any}) => {

  const dispatch = useDispatch();
  
  
    
  const userContacts = useSelector((state: RootState) => state.users.userContacts);
  
  const [removeContact, { isLoading } ] = useRemoveContactMutation();

  const handleRemoveContact = async(contactId: any) => {
    try {
      
      await removeContact({ contactId }).unwrap();

      dispatch(setUserContacts(userContacts?.filter((c: any) => c?._id !== contactId)));
      setAllContacts(allContacts?.filter((c: any) => c?._id !== contactId));

    } catch (error:any) {
      toast.error(error?.data?.message || error?.message || 'error deleting contact!');
    }
  };

  return (
    <div className="fixed -left-[8%] md:left-[25%] lg:left-[15.13%] top-[22%] md:top-[18%] lg:top-[32%] bg-slate-600 text-gray-50 w-[115%] md:w-[75%] lg:w-[44.3%] h-[100%] md:h-[100%] lg:h-[70%] z-50  overflow-y-auto shadow-lg p-10">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">📇 { allContacts?.length > 0 ? "Contacts":"No Contacts" }</h2>

      <motion.div>
        {allContacts.map((contact:any) => (
          <motion.div
            key={contact._id}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="flex items-center justify-between p-2 md:p-3 lg:p-4 mb-3 bg-gray-100 rounded-lg shadow-md"
          >
            <div className="flex items-center space-x-0 md:space-x-3 lg:space-x-4">
              <Avatar className="bg-blue-500 text-white" src={contact?.profilePicture } />
              <div className="">
                <h3 className="text-[13px] md:text-[30px] lg:text-[20px] text-slate-700 font-semibold">{contact?.name}</h3>
                <p className="text-gray-600 flex items-center text-[13px] md:text-[20px] lg:text-[20px]"><EmailIcon className="mr-2 text-blue-400 "
                /> {contact.email}</p>
                <p className="text-gray-600 flex items-center text-[13px] md:text-[20px] lg:text-[20px]"><PhoneIcon className="mr-2 text-green-400" /> +{contact.phone}</p>
              </div>
            </div>

            <div className="flex items-center lg:space-x-3">
              <span className={`px-1 md:px-2 lg:px-3 py-1 rounded-full text-sm text-[16px] md:text-[20px] lg:text-[20px] ${contact.about === "active" ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"}`}>
                {contact.about === "active" ? <VerifiedIcon className="mr-1" /> : <CancelIcon className="mr-1" />}
                {contact.about}
              </span>

              <IconButton onClick={() => handleRemoveContact(contact._id)} className="hover:bg-red-100 transition absolute right-[9%] md:right-[0%] lg:right-[0%]">
                {
                  isLoading ? "Deleting..." : <DeleteIcon
                     sx={{
                      fontSize: {
                        xs: "20px",
                        sm: "20px",
                        md: "70px",
                        lg: "35px",
                      },
                    }}
                    className="text-red-500" />
                }
              </IconButton>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default ContactsList;
