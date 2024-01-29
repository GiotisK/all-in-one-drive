import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { routes } from '../shared/constants/routes';
import { useAppDispatch } from '../redux/store/store';
import { authorizeUser } from '../redux/async-actions/user.async.actions';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store/types';

export const useCheckAuthAndRedirect = () => {
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const location = useLocation();

	const isAuthenticated = useSelector((state: RootState) => state.user.isAuthenticated);
	const authorizeReq = useSelector((state: RootState) => state.user.requests.authorize);
	const loginReq = useSelector((state: RootState) => state.user.requests.login);

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

	// Redirect to /drive if authenticated request is done and is successful
	useEffect(() => {
		if (isAuthenticated && authorizeReq.done) {
			navigate(routes.drive);
		}
	}, [authorizeReq.done, isAuthenticated, navigate]);

	// Redirect from /drive back to login if not authenticated
	useEffect(() => {
		if (!isAuthenticated && authorizeReq.done && location.pathname === routes.drive) {
			navigate(routes.login);
		}
	}, [authorizeReq.done, isAuthenticated, location.pathname, navigate]);
};
