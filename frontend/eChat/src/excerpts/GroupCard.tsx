
import { useDispatch, useSelector } from 'react-redux';
import { setGroupInfo, setGroupId } from '../store/slices/groupSlice';
import { RootState } from '../store/store';
import {  setIsChatPageShown, setIsGroupChat } from '../store/slices/displaySlice';

const GroupCard = ({ group }: any) => {
  const dispatch = useDispatch();
  const groupId: any = useSelector((state: RootState) => state.group.groupId);

   const isGroupChat = useSelector((state: RootState) => state.display.isGroupChat);
    const isSingleChat = useSelector((state: RootState) => state.display.isSingleChat);
   



  return (
    <div
      key={group._id}
      onClick={() => {
        dispatch(setIsGroupChat(true))
        dispatch(setGroupId(group?._id));
        dispatch(setIsChatPageShown(true));

        dispatch(setGroupInfo(group));
      // dispatch(setReceiverInfo(null))
          
        
      }}
      className={`flex items-center gap-5 bg-${isGroupChat && !isSingleChat && group?._id === groupId ? "teal-950":"gray-950"} hover:from-gray-700 hover:via-gray-600 hover:to-gray-700 transition-all duration-300 rounded-xl shadow-lg p-4 cursor-pointer transform hover:scale-105`}
    >
      <div className="flex-shrink-0">
        <div
          className="w-12 h-12 flex items-center justify-center bg-indigo-600 rounded-full text-white text-lg font-bold"
        >
          {group.name[0].toUpperCase()}
        </div>
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-white text-lg">{group.name}</h2>
          <span className="text-gray-400 text-sm">
            {new Date(group.createdAt).toLocaleDateString()}
          </span>
        </div>
        <p className="text-gray-300 text-sm mt-2">
          Group with <span className="font-bold">{group.members.length}</span> members
        </p>
      </div>
    </div>
  );
};

export default GroupCard;
