import React, { useEffect, useRef} from "react";
import { AnimatePresence } from "framer-motion";
import axios from "axios";
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
import { setUserContacts } from "../store/slices/userSlice";
import { toast } from "react-toastify";

import Settings from "../components/Settings";
import { setIsContactsListShown, setIsMoreOptionsShown } from "../store/slices/displaySlice";
import ThemeSwitcher from "../utils/ThemeSwitcher";
import ProfilePic from "../miscellaneous/ProfilePic";
import AddNewContact from "../miscellaneous/AddNewContact";
import ContactsList from "../miscellaneous/ContactsList";

const Home: React.FC = () => {

  const dispatch = useDispatch();

  const {
    isNewChatShown,
    isCreateGroupShown,
    isMoreOptionsShown,
    isAddNewMemberShown,
    isNotificationShown,
    isSettingsShown,
    isReceiverPicShown,
    isAddNewContactShown,
    isContactsListShown,
  } = useSelector((state: RootState) => state.display);


  const moreOptionsRef = useRef<HTMLDivElement | null>(null);
  const contactsListRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
      (
        async () => {
  
          try {
            const response = await axios.get('https://echat-fieq.onrender.com/api/users/getContacts', {
              withCredentials:true
            });
            if (response?.data?.contacts) {
              dispatch(setUserContacts(response?.data?.contacts));
              
            }
  
          } catch (error:any) {
            toast.error(error?.data?.message || error?.message || 'failed to fetch contacts');
          }
        }
  
      )()
    },[]);


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
    
  }, []);

  useEffect(() => {

    const handleShowContactsList = (e: any) => {
      if (contactsListRef.current && !contactsListRef.current.contains(e.target)) {
        dispatch(setIsContactsListShown(false));
      
      }
    }

    window.addEventListener("mousedown", handleShowContactsList);

    return () => {
      window.removeEventListener('mousedown', handleShowContactsList);
    }
    
  },[])


  return (
    <React.Fragment>
      <div className="relative">
        {!isNewChatShown && !isCreateGroupShown && <Header />}
        {isMoreOptionsShown && <div ref={moreOptionsRef}>
          <MoreOptions />
        </div>}
        {
          isContactsListShown && <div ref={contactsListRef}>
             <AnimatePresence>
          { isContactsListShown && <ContactsList/>}
        </AnimatePresence>
          </div>
        }
       
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
        
        <AnimatePresence>{isAddNewContactShown && <AddNewContact />}</AnimatePresence>
        {!isNewChatShown && !isCreateGroupShown && <Contacts />}
        {isNotificationShown && <NotificationModal />}
        {isSettingsShown && <Settings />}
        { isReceiverPicShown && <ProfilePic/>}
        <ChatPage />
        <ThemeSwitcher/>
        
      </div>
      
    </React.Fragment>
  );
};

export default Home;
