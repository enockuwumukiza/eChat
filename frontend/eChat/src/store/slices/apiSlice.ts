import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const baseQuery = fetchBaseQuery({ baseUrl: '/api' });

export const apiSlice = createApi({
    baseQuery,
    reducerPath: 'api',
    tagTypes: ['User','Groups', 'Messages','GroupMembers', 'GroupMessages'],
    endpoints: (builder) => ({})
});