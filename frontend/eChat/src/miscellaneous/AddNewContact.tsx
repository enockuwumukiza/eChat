import React, { useEffect, useState }  from 'react';
import { Divider, IconButton, Input, Tooltip } from '@mui/material';
import {
  Cancel,
  
} from '@mui/icons-material';
import { motion } from 'framer-motion'
import { toast } from 'react-toastify';
import { useDebounce } from 'use-debounce';
import { useDispatch} from 'react-redux';
import { setIsAddNewContactShown, setIsNewChatShown } from '../store/slices/displaySlice';
import { useLazySearchUsersQuery } from '../store/slices/usersApiSlice';

import { useAddContactsMutation } from '../store/slices/usersApiSlice';


const AddNewContact = ({ setAllContacts, allContacts}:{setAllContacts:any, allContacts:any}) => {

  const dispatch = useDispatch();

  const [searchInput, setSearchInput] = useState<string>('');
  const [foundUsers, setFoundUsers] = useState<any[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<any[]>([]);


  const [triggerGetSearchedUsers, { data: userList }] = useLazySearchUsersQuery();
  
  const [ addContacts ,{ isLoading }] = useAddContactsMutation();


    // Debounce the search input value
    const [debouncedSearchInput] = useDebounce(searchInput, 200);

    // Trigger search query whenever debounced input changes
    useEffect(() => {
        if (debouncedSearchInput.trim()) {
          triggerGetSearchedUsers(debouncedSearchInput);
          
        } else {
          setFoundUsers([])
        }
    }, [debouncedSearchInput, triggerGetSearchedUsers]);
  
  useEffect(() => {
    if (userList?.users) {
      setFoundUsers(userList?.users);
    }
  }, [userList]);





  const closeContact = () => {
    dispatch(setIsAddNewContactShown(false));
    
    }
    

  const addSelectedUser = (user: any) => {
    if (!selectedUsers?.find((u: any) => u?._id === user?._id)) {
      setSelectedUsers((prev) => [...prev, user]);
      
    }
  }

  const removeSelectedUser = (user: any) => {
    setSelectedUsers(selectedUsers?.filter((u: any) => u?._id !== user?._id));
  }

  const handleAddContacts = async () => {
    
    try {
      if (!selectedUsers || selectedUsers.length === 0) {
        toast.error("Please select at least one contact");
        return;
      }

      const contactNames = selectedUsers.map((u) => u?.name);

      const response = await addContacts({ contactNames }).unwrap();
      

      setAllContacts((prev:any) => (prev?.length > 1 ? [...prev, response?.contacts]: response?.contacts))
      dispatch(setIsAddNewContactShown(false));
      dispatch(setIsNewChatShown(false));
      
      console.log('response: ', response);
      console.log('all contacts: ', allContacts);
      
    } catch (error: any) {
      console.error("Error adding contacts:", error);
      toast.error(error?.data?.message || error?.message || "Error adding new contact(s)");
    }
  };



  const DisplayFoundUsers = () => {
    return (
        <div
          className='fixed left-0 md:left-48 lg:left-52 top-64 md:top-96 lg:top-80 bg-slate-950 text-white w-[100%] md:w-[74%] lg:w-[42%] z-10 max-h-[100%] md:max-h-[100%] lg:max-h-[60%] p-6 rounded-lg shadow-2xl border border-gray-700 overflow-y-auto'
          
        style={{
          maxHeight:"60vh"
        }}
        >
          {
             foundUsers?.length > 0 ? (foundUsers?.map((user:any, index:any) => (
          <div key={index} onClick={() => addSelectedUser(user)}>
                 <div className="flex items-center gap-4 p-4 hover:bg-gradient-to-r from-purple-600 to-blue-700 rounded-lg transition-all duration-300 ease-in-out cursor-pointer" 
                   
            >
              <img
                className="w-14 h-14 rounded-full object-cover shadow-md"
                src={user?.profilePicture || 'https://media.istockphoto.com/id/1249078123/photo/university-student-portrait-in-campus.webp?b=1&s=612x612&w=0&k=20&c=k6mQoUyBCYBRZM2ALqaOOU4UUG5USpJzvWQleWNdh0Q='}
                alt={`${user?.name}'s profile`}
              />
              <div>
                <span className="block text-lg font-semibold">{user?.name}</span>
                <span className="block text-sm font-bold text-sky-300">{user?.phone}</span>
              </div>
            </div>
            {index < foundUsers?.length - 1 && (
              <Divider className="border-gray-600 my-2" />
            )}
          </div>
        ))) :<p>No users found</p>
        
        }
    </div>
    )
  }

  
  return (
    <React.Fragment>
          <motion.div className="fixed left-0 md:left-52 md:-ml-2 flex flex-col z-50 gap-3 bg-sky-600 p-2 w-[100%] md:w-[74%] lg:w-[44.4%] shadow-xl shadow-gray-800 text-white h-full"
            
              initial={{ x: '130%' }}
              animate={{ x: '0%' }}
              exit={{ x: '180%' }}
              transition={{type:'spring', stiffness:100, damping:20}}
      >
        {/* Header */}
        <div className="flex items-center gap-4">
          <IconButton className="hover:bg-sky-800 transition-all" onClick={closeContact}>
            <Cancel fontSize="large" htmlColor="white" />
          </IconButton>
          <p className="text-2xl font-semibold">Add Contact</p>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Input

            placeholder="Search name or number"
            value={searchInput}

             sx={{
                fontSize: {
                            xs: "20px",
                            sm: "25px",
                            md: "27px",
                            lg: "20px",
                },
                color:"white"
          }}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full pl-14 pr-4 py-2 bg-sky-800 rounded-lg text-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all"
          />
        </div>

        {
                  selectedUsers?.length > 0 &&
                  <div className='grid bg-emerald-900 grid-cols-2 md:grid-cols-2 lg:grid-cols-3 lg:gap-2 p-1 md:p-2 rounded-2xl overflow-y-auto' style={{
          maxHeight:"30vh"
        }}>
          
          {
            selectedUsers.length > 0 && (
              selectedUsers?.map((user: any, index: any) => (
                <div key={index} className='flex gap-1 md:gap-2 lg:gap-2 bg-sky-800 align-middle rounded-lg'>
                  <img className='h-7 w-7 md:h-10 md:w-10 lg:h-10 lg:w-10 object-fill rounded-full' src={user?.profilePicture} alt={user?.name} />
                  <span className='mt-1 text-sm'>{ user?.name}</span>
                  <Tooltip title='remove' placement='top'>
                    <IconButton onClick={() => removeSelectedUser(user)}>
                      <Cancel fontSize='small' htmlColor='white'/>
                    </IconButton>
                  </Tooltip>
                </div>
              ))
            )
          }
         
          {
            selectedUsers?.length > 0 && <div className='pt-2'>
                  <button className='btn btn-primary max-w-full 
                  '
                    onClick={handleAddContacts}
                  >
                    {
                      isLoading ? "Adding...":"Add"
                    }
                  </button>
            </div>
          }
        </div>


        }

       
        {
          searchInput && <DisplayFoundUsers/>
       }

      </motion.div>
    </React.Fragment>
  );
};

export default AddNewContact;
