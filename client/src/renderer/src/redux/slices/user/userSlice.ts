import { createSlice } from '@reduxjs/toolkit';
import { UserState } from './types';
import { userApi } from '../../rtk/userApi';

const initialState: UserState = {
    isAuthenticated: null,
    email: '',
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addMatcher(
                userApi.endpoints.authorizeUser.matchFulfilled,
                (state, { payload: { email } }) => {
                    state.isAuthenticated = true;
                    state.email = email;
                }
            )
            .addMatcher(userApi.endpoints.authorizeUser.matchRejected, state => {
                state.isAuthenticated = false;
            })
            .addMatcher(userApi.endpoints.logoutUser.matchFulfilled, state => {
                state.isAuthenticated = false;
                state.email = '';
            })
            .addMatcher(
                userApi.endpoints.loginUser.matchFulfilled,
                (state, { payload: { email } }) => {
                    state.isAuthenticated = true;
                    state.email = email;
                }
            );
    },
});

export default userSlice.reducer;
