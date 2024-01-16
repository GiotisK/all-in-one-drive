import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setDrives } from '../redux/slices/drives/drivesSlice';
import { getDriveEntities } from '../services/drives/drives.service';

export const useFetchDrives = () => {
	const dispatch = useDispatch();

	useEffect(() => {
		let ignore = false;

		(async () => {
			const driveEntities = await getDriveEntities();

			if (driveEntities && !ignore) {
				dispatch(setDrives(driveEntities));
			}
		})();

		return () => {
			ignore = true;
		};
	}, [dispatch]);
};
