import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setDrives } from '../redux/slices/drives/drivesSlice';
import { getDriveEntities } from '../services/drives/drives.service';

export const useFetchDrives = () => {
	const dispatch = useDispatch();

	useEffect(() => {
		(async () => {
			const driveEntities = await getDriveEntities();
			console.log('===driveEntities', driveEntities);
			driveEntities && dispatch(setDrives(driveEntities));
		})();
	}, [dispatch]);
};
