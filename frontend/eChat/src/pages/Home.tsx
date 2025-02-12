import React, { useEffect, useRef} from "react";
import { AnimatePresence } from "framer-motion";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Contacts from "../components/Contacts";
import ChatPage from "./ChatPage";
import ProfileModal from "../miscellaneous/ProfileModal";
import NewChat from "../miscellaneous/NewChat";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import GroupChat from "../miscellaneous/GroupChat";
import MoreOptions from "../miscellaneous/MoreOptions";
import GroupInfo from "../miscellaneous/GroupInfo";
import UserInfoModal from "../miscellaneous/UserInfoModal";
import GroupOptionsModal from "../miscellaneous/GroupOptions";
import AddMemberToGroup from "../miscellaneous/AddMemberToGroup";
import NotificationModal from "../miscellaneous/NotificationModal";

import Settings from "../components/Settings";
import { setIsMoreOptionsShown } from "../store/slices/displaySlice";

const Home: React.FC = () => {

  const dispatch = useDispatch();

  const {
    isNewChatShown,
    isCreateGroupShown,
    isMoreOptionsShown,
    isAddNewMemberShown,
    isNotificationShown,
    isSettingsShown,
  } = useSelector((state: RootState) => state.display);


  const moreOptionsRef = useRef<HTMLDivElement | null>(null);


  useEffect(() => {

    const handleShowMoreOptions = (e: any) => {
      if (moreOptionsRef.current && !moreOptionsRef.current.contains(e.target)) {
        dispatch(setIsMoreOptionsShown(false));
      
      }
    }

    window.addEventListener("mousedown", handleShowMoreOptions);

    return () => {
      window.removeEventListener('mousedown', handleShowMoreOptions);
    }
    
  },[])


  return (
    <React.Fragment>
      <div className="relative">
        {!isNewChatShown && !isCreateGroupShown && <Header />}
        {isMoreOptionsShown && <div ref={moreOptionsRef}>
          <MoreOptions />
        </div>}
       
        <Sidebar />
        <ProfileModal />
        <GroupInfo />
        <UserInfoModal />
        <GroupOptionsModal/>
        <AnimatePresence>{isNewChatShown && <NewChat />}</AnimatePresence>
        <AnimatePresence>
          { isAddNewMemberShown && <AddMemberToGroup/>}
        </AnimatePresence>
        <AnimatePresence>{isCreateGroupShown && <GroupChat />}</AnimatePresence>
        {!isNewChatShown && !isCreateGroupShown && <Contacts />}
        {isNotificationShown && <NotificationModal />}
        { isSettingsShown && <Settings/>}
        <ChatPage />
        {/* { <FoundUsers />} */}
        
      </div>
      
    </React.Fragment>
  );
};

export default Home;
