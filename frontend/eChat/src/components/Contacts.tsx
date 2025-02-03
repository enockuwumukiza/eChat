import React, { useEffect} from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { useLazyGetUsersQuery } from "../store/slices/usersApiSlice";
import { useLazyGetGroupsQuery } from "../store/slices/groupApiSlice";
import { RootState } from "../store/store";

import { Divider } from "@mui/material";

import GroupCard from "../excerpts/GroupCard";
import ContactCard from "../excerpts/ContactCard";
import { setGroupData } from "../store/slices/groupSlice";
import { setUsers } from "../store/slices/userSlice";

const Contacts: React.FC = () => {
  const dispatch = useDispatch();


  const isGroupChat = useSelector((state: RootState) => state.display.isGroupChat);
  const isSingleChat = useSelector((state: RootState) => state.display.isSingleChat);
  const currentWindowWidth = useSelector((state: RootState) => state.display.currentWindowWidth);
   
  const isChatPageShown = useSelector((state: RootState) => state.display.isChatPageShown);
 

  // API hooks
  const [triggerGetUsers, { data: usersData, isLoading }] = useLazyGetUsersQuery();
  const [triggerGetGroups, { data: groupsData }] = useLazyGetGroupsQuery();

  useEffect(() => {
    triggerGetUsers(undefined);
  }, [triggerGetUsers]);

  useEffect(() => {
    triggerGetGroups(undefined);
  }, [triggerGetGroups]);

  useEffect(() => {
    dispatch(setGroupData(groupsData));
  })

  const userList = usersData?.users || [];
  const groupList = groupsData?.groups || [];

  useEffect(() => {
    if (userList) {
      dispatch(setUsers(userList));
    }
  }, [userList, dispatch]);

  if (isLoading) {
    return (
      <div className={``}>
         <div className="absolute left-[30%] top-80">
        <div>
          <span className="loading loading-ring loading-lg"></span>
          <motion.div
            
            animate={{
              y:[0,-20,0]
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              repeatType: "loop",
              ease:"easeInOut"
            }}
          >
            <p className="font-semibold text-xl">Loading, please wait...</p>
          </motion.div>
        </div>
      </div>
     </div>
    )
  }
  

  return (
    <div className="">
      <div
        className={`fixed sm:left-1 md:left-[25%] lg:left-[15.2%] top-56 bg-gray-900 text-gray-50 w-full sm:w-[100%] md:w-[81%] lg:w-[44.6%] h-[100%] md:max-h-[80%] lg:max-h-[70%] p-10 rounded-lg overflow-y-auto shadow-lg -mt-2 `}
     
    >
      {isSingleChat && !isGroupChat ? (
        userList.length > 0 ? (
          userList.map((user: any) => (
            <React.Fragment key={user._id}>
              <ContactCard user={user} />
              <Divider className="my-4 bg-gray-700" />
            </React.Fragment>
          ))
        ) : (
          <div className="text-center text-gray-400">No users found</div>
        )
      ) : groupList.length > 0 ? (
        groupList.map((group: any) => (
          <React.Fragment key={group._id}>
            <GroupCard group={group} />
            <Divider className="my-4 bg-gray-700" />
          </React.Fragment>
        ))
      ) : (
        <div className="text-center text-gray-400">No groups found</div>
      )}
    </div>
    </div>
  );
};

export default Contacts;
