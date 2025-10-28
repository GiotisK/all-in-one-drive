import { FileRow } from '../components/FileRow';
import { Loader } from '../components/Loader';
import { styled } from 'styled-components';
import { useActiveDriveFiles } from '../hooks/useActiveDriveFiles';
import { useGetDrivesQuery } from '../redux/rtk/driveApi';
import { MenuBanner } from './MenuBanner';

const LoaderContainer = styled.div`
	height: 100px;
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
			<Loader size={15} />
		</LoaderContainer>
	) : shouldShowEmptyState ? (
		<NoFilesText>No files exist...</NoFilesText>
	) : (
		<div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
			<MenuBanner />
			{files.map(file => (
				<FileRow key={file.id} file={file} />
			))}
		</div>
	);
};
