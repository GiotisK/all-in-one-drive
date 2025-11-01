import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const userApi = createApi({
    reducerPath: 'userApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8000/users', credentials: 'include' }),
    endpoints: builder => ({
        loginUser: builder.mutation<{ email: string }, { email: string; password: string }>({
            query: ({ email, password }) => ({
                url: '/login',
                method: 'POST',
                body: { email, password },
            }),
        }),
        logoutUser: builder.mutation<void, void>({
            query: () => ({
                url: '/logout',
                method: 'POST',
            }),
        }),
        registerUser: builder.mutation<void, { email: string; password: string }>({
            query: ({ email, password }) => ({
                url: '/register',
                method: 'POST',
                body: { email, password },
            }),
        }),
        authorizeUser: builder.query<{ email: string }, void>({
            query: () => ({
                url: '/auth',
            }),
        }),
    }),
});

export const {
    useLoginUserMutation,
    useLogoutUserMutation,
    useRegisterUserMutation,
    useAuthorizeUserQuery,
} = userApi;
