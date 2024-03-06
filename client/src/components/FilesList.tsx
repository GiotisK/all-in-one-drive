import { useAppSelector } from '../redux/store/store';
import { FileRow } from '../components/FileRow';
import { Loader } from '../components/Loader';
import { styled } from 'styled-components';
import { useActiveDriveFiles } from '../hooks/useActiveDriveFiles';

const LoaderContainer = styled.div`
	margin-top: 3%;
`;
const NoFilesText = styled.p`
	text-align: center;
	margin: 0;
	margin-top: 5%;
	color: gray;
	font-size: 20px;
`;

export const FilesList = () => {
	const activeDriveFiles = useActiveDriveFiles();
	const filesLoading = useAppSelector(state => state.files.requests.getFiles.loading);
	const folderFilesLoading = useAppSelector(
		state => state.files.requests.getFolderDriveFiles.loading
	);
	const filesDone = useAppSelector(state => state.files.requests.getFiles.done);
	const folderFilesDone = useAppSelector(state => state.files.requests.getFolderDriveFiles.done);
	const showEmptyFilesState = (filesDone || folderFilesDone) && !activeDriveFiles.length;

	return filesLoading || folderFilesLoading ? (
		<LoaderContainer>
			<Loader size={25} />
		</LoaderContainer>
	) : showEmptyFilesState ? (
		<NoFilesText>No files exist...</NoFilesText>
	) : (
		<>
			{activeDriveFiles.map(file => (
				<FileRow key={file.id} file={file} />
			))}
		</>
	);
};
