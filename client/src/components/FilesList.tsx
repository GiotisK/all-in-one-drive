import { useAppSelector } from '../redux/store/store';
import { FileRow } from '../components/FileRow';
import { Loader } from '../components/Loader';
import { styled } from 'styled-components';

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
	const files = useAppSelector(state => state.files.files);
	const filesLoading = useAppSelector(state => state.files.requests.getFiles.loading);
	const folderFilesLoading = useAppSelector(
		state => state.files.requests.getFolderDriveFiles.loading
	);
	const filesDone = useAppSelector(state => state.files.requests.getFiles.done);
	const folderFilesDone = useAppSelector(state => state.files.requests.getFolderDriveFiles.done);
	const showEmptyFilesState = (filesDone || folderFilesDone) && !files.length;

	return filesLoading || folderFilesLoading ? (
		<LoaderContainer>
			<Loader size={25} />
		</LoaderContainer>
	) : showEmptyFilesState ? (
		<NoFilesText>No files exist...</NoFilesText>
	) : (
		<>
			{files.map(file => (
				<FileRow key={file.id} file={file} />
			))}
		</>
	);
};
