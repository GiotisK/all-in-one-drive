import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/store/store';
import { authorizeUser } from '../redux/async-actions/user.async.actions';

export const useCheckAuth = () => {
	const dispatch = useAppDispatch();
	const isAuthenticated = useAppSelector(state => state.user.isAuthenticated);
	const authorizeReq = useAppSelector(state => state.user.requests.authorize);
	const loginReq = useAppSelector(state => state.user.requests.login);

	// The first time, check if authorized
	useEffect(() => {
		if (authorizeReq.loading || authorizeReq.error || authorizeReq.done) return;
		dispatch(authorizeUser());
	}, [dispatch, authorizeReq.done, authorizeReq.error, authorizeReq.loading]);

	// After login, check if authorized
	useEffect(() => {
		if (loginReq.done && !isAuthenticated) {
			dispatch(authorizeUser());
		}
	}, [dispatch, isAuthenticated, loginReq.done]);
};
