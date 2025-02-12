import React from 'react';
import { Divider } from '@mui/material';
import { RootState } from '../store/store';
import { useSelector, useDispatch } from 'react-redux';
import { setIsChatPageShown } from '../store/slices/displaySlice';
import { setReceiverInfo } from '../store/slices/messageSlice';

const FoundUsers: React.FC<any> = ({ setSearchInput }) => {

  const [ isShown, setIsShown ] = React.useState<boolean>(true)

  const dispatch = useDispatch();

  const userList = useSelector((state: RootState) => state.search.searchedUsers);
  
  return (
    <div
      className={`${isShown ? 'fixed' : 'hidden'} left-0 md:left-48 lg:left-52 top-56 bg-gradient-to-br from-indigo-700 via-purple-800 to-blue-900 text-white w-[100%] md:w-[75%] lg:w-[43%] z-10 max-h-[100%] md:max-h-[100%] lg:max-h-[80%] p-6 rounded-lg shadow-2xl border border-gray-700 overflow-y-auto`}
     
    >
      {userList.length > 0 ? (userList.map((user:any, index:any) => (
        <React.Fragment key={index}>
          <div className="flex items-center gap-4 p-4 hover:bg-gradient-to-r from-purple-600 to-blue-700 rounded-lg transition-all duration-300 ease-in-out cursor-pointer"
            
            onClick={() => {
              dispatch(setReceiverInfo(user));
              setIsShown(false);
              setSearchInput('');
              dispatch(setIsChatPageShown(true));

            }
            }
          >
            <img
              className="w-14 h-14 rounded-full object-cover shadow-md"
              src={user?.profilePicture || 'https://media.istockphoto.com/id/1249078123/photo/university-student-portrait-in-campus.webp?b=1&s=612x612&w=0&k=20&c=k6mQoUyBCYBRZM2ALqaOOU4UUG5USpJzvWQleWNdh0Q='}
              alt={`${user.name}'s profile`}
            />
            <div>
              <span className="block text-lg font-semibold">{user.name}</span>
              <span className="block text-sm font-bold italic text-sky-300">{user.phone}</span>
            </div>
          </div>
          {index < userList.length - 1 && (
            <Divider className="border-gray-600 my-2" />
          )}
        </React.Fragment>
      ))) :<p>No users found</p>
      }
    </div>
  );
};

export default FoundUsers;
