import { useEffect, useState } from 'react';
import { useAppSelector } from '../redux/store/store';
import { FileEntity } from '../shared/types/global.types';

export const useFilterFilesByDrive = () => {
	const drives = useAppSelector(state => state.drives.drives);
	const files = useAppSelector(state => state.files.files);
	const [filteredFiles, setFilteredFiles] = useState<FileEntity[]>([]);

	useEffect(() => {
		const filteredFiles2 = files.filter(file =>
			drives.some(
				drive => drive.email === file.email && drive.type === file.drive && drive.active
			)
		);

		setFilteredFiles(filteredFiles2);
	}, [drives, files]);

	return filteredFiles;
};
