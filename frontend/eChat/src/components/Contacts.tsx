import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { setUsers } from "../store/slices/userSlice";
import { useLazyGetUsersQuery } from "../store/slices/usersApiSlice";
import { useLazyGetGroupsQuery } from "../store/slices/groupApiSlice";
import { RootState } from "../store/store";
import { Divider } from "@mui/material";

import GroupCard from "../excerpts/GroupCard";
import ContactCard from "../excerpts/ContactCard";
import { setGroupData } from "../store/slices/groupSlice";
import NoContactsMessage from "../utils/NoContactsMessage";


const Contacts: React.FC = () => {
  const dispatch = useDispatch();

  const isGroupChat = useSelector((state: RootState) => state.display.isGroupChat);
  const isSingleChat = useSelector((state: RootState) => state.display.isSingleChat);
  const users = useSelector((state: RootState) => state.users?.userContacts);

  // API hooks
  const [triggerGetUsers, { data: usersData, isLoading }] = useLazyGetUsersQuery();
  const [triggerGetGroups, { data: groupsData }] = useLazyGetGroupsQuery();

  useEffect(() => {
    triggerGetUsers(undefined);
    triggerGetGroups(undefined);
  }, []); // Runs only once when the component mounts

  useEffect(() => {
    if (groupsData) {
      dispatch(setGroupData(groupsData));
    }
  }, [groupsData, dispatch]);

  useEffect(() => {
    if (usersData?.users?.length > 0) {
      dispatch(setUsers(usersData.users));
    }
  }, [usersData, dispatch]);

  

  if (isLoading) {
    return (
      <div className="absolute left-[30%] top-80">
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
    );
  }

  
  const groupList = groupsData?.groups || [];

  return (
    <div  className="fixed -left-[8%] md:left-[25%] lg:left-[15.13%] top-[22%] md:top-[18%] lg:top-[32%] bg-gray-900 text-gray-50 w-[115%] md:w-[81%] lg:w-[44.3%] h-[100%] md:h-[100%] lg:h-[70%]  overflow-y-auto shadow-lg p-10"
      
      
      
    >
      {isSingleChat && !isGroupChat ? (
        users.length > 0 ? (
          users.map((user:any) => (
            <React.Fragment key={user._id}>
              <ContactCard user={user} />
              <Divider className="" sx={{
                width: {
                  xs: '100%',
                  sm: "100%",
                  md: '100%',
                  lg:'100%'
                },
                margin: {
                  xs: '0px 0px',
                  sm: "0px -24px",
                  md: '0px -20px',
                  lg:'0px -23px'
                }
              }} />
            </React.Fragment>
          ))
        ) : (
            <NoContactsMessage/>
        )
      ) : groupList.length > 0 ? (
        groupList.map((group:any) => (
          <React.Fragment key={group._id}>
            <GroupCard group={group} />
            <Divider className="my-4 bg-gray-700" />
          </React.Fragment>
        ))
      ) : (
        <div className="text-center text-gray-400">No groups found</div>
      )}
    </div>
  );
};

export default Contacts;
