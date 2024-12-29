import { apiSlice } from "./apiSlice";

const GROUP_URL = 'groups'

const groupsSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createGroup: builder.mutation({
            query: (data) => ({
                url: GROUP_URL,
                method: 'POST',
                body: data
            }),
            invalidatesTags: ['Groups'], // Invalidate list of groups
        }),
        addGroupMember: builder.mutation({
            query: ({ groupId, data }) => ({
                url: `${GROUP_URL}/add/${groupId}`,
                method: 'POST',
                body: data
            }),
            invalidatesTags: (result, error, { groupId }) => [{ type: 'GroupMembers', id: groupId }], // Invalidate group members
        }),
        removeGroupMember: builder.mutation({
            query: ({ groupId, data }) => ({
                url: `${GROUP_URL}/remove/${groupId}`,
                method: 'POST',
                body: data
            }),
            invalidatesTags: (result, error, { groupId }) => [{ type: 'GroupMembers', id: groupId }], // Invalidate group members
        }),
        getGroups: builder.query({
            query: () => GROUP_URL,
            providesTags: ['Groups'], // Provide tag for groups list
        }),
        getGroupById: builder.query({
            query: (groupId) => `${GROUP_URL}/${groupId}`,
             
        }),
        getGroupMembers: builder.query({
            query: (groupId) => `${GROUP_URL}/members/${groupId}`,
            providesTags: (result, error, groupId) => [{ type: 'GroupMembers', id: groupId }], // Provide tag for group members
        }),
        getGroupMessages: builder.query({
            query: (groupId) => `${GROUP_URL}/messages/${groupId}`,
            providesTags: (result, error, groupId) => [{ type: 'GroupMessages', id: groupId }], // Provide tag for messages
        }),
    }),
});

export const {
    useCreateGroupMutation,
    useAddGroupMemberMutation,
    useRemoveGroupMemberMutation,
    useLazyGetGroupsQuery,
    usePrefetch,
    useLazyGetGroupByIdQuery,
    useLazyGetGroupMembersQuery,
    useLazyGetGroupMessagesQuery,
} = groupsSlice;
