import React from "react";
import { AnimatePresence } from "framer-motion";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Contacts from "../components/Contacts";
import ChatPage from "./ChatPage";
import ProfileModal from "../miscellaneous/ProfileModal";
import NewChat from "../miscellaneous/NewChat";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import GroupChat from "../miscellaneous/GroupChat";
import MoreOptions from "../miscellaneous/MoreOptions";
import GroupInfo from "../miscellaneous/GroupInfo";
import UserInfoModal from "../miscellaneous/UserInfoModal";
import GroupOptionsModal from "../miscellaneous/GroupOptions";
import AddMemberToGroup from "../miscellaneous/AddMemberToGroup";
// import FoundUsers from "../miscellaneous/FoundUsers";

const Home: React.FC = () => {
  const {
    isNewChatShown,
    isCreateGroupShown,
    isMoreOptionsShown,
    isAddNewMemberShown
  } = useSelector((state: RootState) => state.display);

  // const { searchQuery, searchedUsers } = useSelector(
  //   (state: RootState) => state.search
  // );

  return (
    <React.Fragment>
      <div className="relative">
        {!isNewChatShown && !isCreateGroupShown && <Header />}
        {isMoreOptionsShown && <MoreOptions />}
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
        <ChatPage />
        {/* { <FoundUsers />} */}
      </div>
    </React.Fragment>
  );
};

export default Home;
