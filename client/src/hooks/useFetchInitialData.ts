import { useEffect, useRef } from 'react';
import { getDrives } from '../redux/async-actions/drives.async.actions';
import { useAppDispatch, useAppSelector } from '../redux/store/store';

//TODO: since getfiles got removed maybe rename to usegetdrives or sth
export const useFetchInitialData = () => {
	const dispatch = useAppDispatch();
	const isAuthenticated = useAppSelector(state => state.user.isAuthenticated);
	const areRequestsSent = useRef<boolean>(false);

	useEffect(() => {
		if (!isAuthenticated || areRequestsSent.current) return;
		areRequestsSent.current = true;
		dispatch(getDrives());
	}, [dispatch, isAuthenticated]);
};
