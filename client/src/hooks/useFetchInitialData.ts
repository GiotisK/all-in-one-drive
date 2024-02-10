import { useEffect, useRef } from 'react';
import { getDrives } from '../redux/async-actions/drives.async.actions';
import { useAppDispatch, useAppSelector } from '../redux/store/store';
import { getRootFiles } from '../redux/async-actions/files.async.actions';

export const useFetchInitialData = () => {
	const dispatch = useAppDispatch();
	const isAuthenticated = useAppSelector(state => state.user.isAuthenticated);
	const areRequestsSent = useRef<boolean>(false);

	useEffect(() => {
		if (!isAuthenticated || areRequestsSent.current) return;
		areRequestsSent.current = true;
		dispatch(getDrives());
		dispatch(getRootFiles());
	}, [dispatch, isAuthenticated]);
};
