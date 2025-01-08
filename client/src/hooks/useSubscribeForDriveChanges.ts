import { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/store/store';
import { subscribeForChanges } from '../redux/async-actions/drives.async.actions';
import { useGetDrivesQuery } from '../redux/rtk/driveApi';

export const useSubscribeForDriveChanges = () => {
	const dispatch = useAppDispatch();
	const { isAuthenticated } = useAppSelector(state => state.user);
	const { data: drives = [] } = useGetDrivesQuery();

	const subscriptionDone = useRef<boolean>(false);

	useEffect(() => {
		if (subscriptionDone.current) {
			return;
		}

		if (isAuthenticated && drives.length > 0) {
			drives.forEach(({ id: driveId }) => {
				dispatch(subscribeForChanges({ driveId }));
			});

			subscriptionDone.current = true;
		}
	}, [dispatch, drives, isAuthenticated]);
};
