import { useEffect, useState } from 'react';
import { IconButton, Input, Tooltip, Modal, CircularProgress } from '@mui/material';
import { Cancel } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { useLazySearchUsersQuery } from '../store/slices/usersApiSlice';
import { useAddGroupMemberMutation } from '../store/slices/groupApiSlice';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { setIsAddNewMemberShown } from '../store/slices/displaySlice';
import { useGroup } from '../hooks/useGroup';

const AddMemberToGroup = () => {
  const { handleJoinGroup } = useGroup();
  const dispatch = useDispatch();
  const [searchInput, setSearchInput] = useState<string>('');
  const [foundUsers, setFoundUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>('');
  const [loading, setLoading] = useState(false);

  const groupId = useSelector((state: RootState) => state.group.groupId);

  const [triggerSearchUsers] = useLazySearchUsersQuery();
  const [addGroupMember, { isLoading }] = useAddGroupMemberMutation();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput.trim()) {
        setLoading(true);
        triggerSearchUsers(searchInput)
          .then(({ data }) => {
            setFoundUsers(data?.users || []);
          })
          .finally(() => setLoading(false));
      } else {
        setFoundUsers([]);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(timer);
  }, [searchInput, triggerSearchUsers]);

  

  const removeSelectedUser = () => {
    setSelectedUser(null);
  };

  const handleAddGroupMember = async () => {
    if (!selectedUser || !selectedUser.name.trim()) {
      toast.error('Please select a valid user.');
      return;
    }

    try {
      // const memberName = selectedUser.name.trim();
      const response = await addGroupMember({ groupId, data:{memberName:selectedUser?.name.trim() }}).unwrap();
      console.log('Response adding member:', JSON.stringify(response));
      handleJoinGroup(response?.data?.newGroup?._id, response?.data?.newGroup?.name, selectedUser?.name);
      
      toast.success('Member added successfully!');
      setSelectedUser(null);
    } catch (error: any) {
      console.error('Error adding new member:', JSON.stringify(error));
      toast.error(error?.data?.message || error?.message || 'Failed to add member.');
    }
  };

  if (isLoading) {
    return <div className='flex mx-auto'>
      <span className='loaing loading-spinner loading-lg'></span>
    </div>
  }

  console.log(`Selected user: ${JSON.stringify(selectedUser)}`)
  return (
    <Modal
      open={true}
      onClose={() => {
        dispatch(setIsAddNewMemberShown(false));
        setSelectedUser(null); // Reset selection on close
      }}
      className="flex justify-center items-center"
    >
      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-6 rounded-3xl shadow-xl max-w-lg w-full mx-4 transform transition-all duration-300 ease-in-out">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">Add New Member</h2>

        <Input
          placeholder="Search Users"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="w-full mb-6 p-4 rounded-lg bg-white text-gray-800 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {loading ? (
          <div className="flex justify-center mb-6">
            <CircularProgress />
          </div>
        ) : (
          <div className="mb-6 max-h-60 overflow-y-auto">
            {foundUsers.length > 0 ? (
              foundUsers.map((user) => (
                <div
                  key={user._id}
                  onClick={() => {
                    setSelectedUser(user);
                    setSearchInput('');
                    setFoundUsers([]);
                  }}
                  className="p-4 cursor-pointer hover:bg-gray-700 rounded-xl transition duration-200 ease-in-out"
                >
                  <span className="text-lg font-medium text-white">{user.name}</span>
                </div>
              ))
            ) : (
              <div className="text-center text-white">No users found</div>
            )}
          </div>
        )}

        {selectedUser && (
          <div className="mb-6 flex items-center gap-3 p-4 bg-gray-700 rounded-xl shadow-md">
            <span className="text-xl font-semibold text-white">{selectedUser?.name}</span>
            <Tooltip title="Remove" arrow>
              <IconButton size="small" onClick={removeSelectedUser} className="text-white">
                <Cancel fontSize="small" />
              </IconButton>
            </Tooltip>
          </div>
        )}

        <button
          onClick={async () => {
            if (selectedUser?.name) {
              await handleAddGroupMember();
              dispatch(setIsAddNewMemberShown(false)); // Close modal only after successful addition
            }
          }}
          disabled={!selectedUser}
          className="w-full py-3 bg-blue-700 hover:bg-blue-800 rounded-lg text-white font-semibold disabled:opacity-50 transition-all duration-200"
        >
          Add Member
        </button>
      </div>
    </Modal>
  );
};

export default AddMemberToGroup;
