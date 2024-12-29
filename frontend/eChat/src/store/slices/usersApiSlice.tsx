import { apiSlice } from "./apiSlice";

const USER_URL = 'users';

const usersApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        registerUser:builder.mutation({
            query: (data) => ({
                url: USER_URL,
                method: 'POST',
                body:data
            })
        }),
        loginUser: builder.mutation({
            query: (data) => ({
                url: `${USER_URL}/login`,
                method: 'POST',
                body:data
            })
        }),
        logoutUser: builder.mutation({
            query: () => ({
                url: `${USER_URL}/logout`,
                method: 'POST',
                credentials:'include'
            })
        }),
        updateUser: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `${USER_URL}/${id}`,
                method: 'PUT',
                body: data,
                credentials:'include'
            })
        }),
        deleteUser: builder.mutation({
            query: (id) => ({
                url: `${USER_URL}/${id}`,
                credentials:'include'
            })
        }),
        getUsers: builder.query({
            query:() => USER_URL
        }),
        getUserById: builder.query({
            query:(id) => `${USER_URL}/${id}`
        }),
        searchUsers: builder.query({
            query:(searchQuery) => `${USER_URL}/search?search=${searchQuery}`
        })
    })
});

export const {

    useRegisterUserMutation,
    useDeleteUserMutation,
    useUpdateUserMutation,
    useLoginUserMutation,
    useLogoutUserMutation,
    useLazyGetUsersQuery,
    useLazyGetUserByIdQuery,
    useLazySearchUsersQuery

} = usersApiSlice;