import { FileRow } from '../components/FileRow';
import { Loader } from '../components/Loader';
import { styled } from 'styled-components';
import { useActiveDriveFiles } from '../hooks/useActiveDriveFiles';
import { useGetDrivesQuery } from '../redux/rtk/driveApi';

const LoaderContainer = styled.div`
	margin-top: 3%;
`;
const NoFilesText = styled.p`
	text-align: center;
	margin: 0;
	margin-top: 5%;
	color: gray;
	font-size: 16px;
`;

export const FilesList = () => {
	const { files, isLoading } = useActiveDriveFiles();
	const { isSuccess: drivesSuccess } = useGetDrivesQuery();

	const shouldShowEmptyState = drivesSuccess && files.length === 0;

	return isLoading ? (
		<LoaderContainer>
			<Loader size={25} />
		</LoaderContainer>
	) : shouldShowEmptyState ? (
		<NoFilesText>No files exist...</NoFilesText>
	) : (
		<>
			{files.map(file => (
				<FileRow key={file.id} file={file} />
			))}
		</>
	);
};
