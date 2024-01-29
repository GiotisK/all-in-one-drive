import { useEffect, useRef } from 'react';
import { getDrives } from '../redux/async-actions/drives.async.actions';
import { useAppDispatch } from '../redux/store/store';
import { getFiles } from '../redux/async-actions/files.async.actions';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store/types';

export const useFetchInitialData = () => {
	const dispatch = useAppDispatch();
	const isAuthenticated = useSelector((state: RootState) => state.user.isAuthenticated);
	const areRequestsSent = useRef<boolean>(false);

	useEffect(() => {
		if (!isAuthenticated || areRequestsSent.current) return;
		areRequestsSent.current = true;
		dispatch(getDrives());
		dispatch(getFiles());
	}, [dispatch, isAuthenticated]);
};
