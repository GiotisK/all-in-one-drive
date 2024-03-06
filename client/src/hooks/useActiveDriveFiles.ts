import { useEffect, useState } from 'react';
import { useAppSelector } from '../redux/store/store';
import { FileEntity } from '../shared/types/global.types';

export const useActiveDriveFiles = () => {
	const drives = useAppSelector(state => state.drives.drives);
	const files = useAppSelector(state => state.files.files);
	const [filteredFiles, setFilteredFiles] = useState<FileEntity[]>([]);

	useEffect(() => {
		const nextFilteredFiles = files.filter(file =>
			drives.some(
				drive => drive.email === file.email && drive.type === file.drive && drive.active
			)
		);

		setFilteredFiles(nextFilteredFiles);
	}, [drives, files]);

	return filteredFiles;
};
