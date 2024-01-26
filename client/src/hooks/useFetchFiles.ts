import { useEffect, useRef, useState } from 'react';
import { getRootFiles } from '../services/drives/files/drives.files.service';
import { useDispatch } from 'react-redux';
import { setFiles } from '../redux/slices/files/filesSlice';

export const useFetchFiles = () => {
	const [loading, setLoading] = useState(true);
	const dispatch = useDispatch();

	useEffect(() => {
		let ignore = false;

		(async () => {
			const fileEntities = await getRootFiles();

			if (fileEntities && !ignore) {
				dispatch(setFiles(fileEntities));
				setLoading(false);
			}
		})();

		return () => {
			ignore = true;
		};
	}, [dispatch, loading]);

	return {
		loading,
	};
};
