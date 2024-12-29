
import { useSelector } from 'react-redux';
import { useAuth } from './useAuth';
import { RootState } from '../store/store';

export const useProtectGroup = () => {

    const { authUser } = useAuth();

    const groupsData:any = useSelector((state: RootState) => state.group.groupData);
    const groupId = useSelector((state: RootState) => state.group.groupId);
    const currentGroup: any = groupsData?.groups?.find((group: any) => group?._id === groupId);

    const memberRole = currentGroup?.members?.find((member: any) => member?.userId === authUser?.user?._id)?.role;
    

    return {
      memberRole,
      currentGroup,
  }
}


