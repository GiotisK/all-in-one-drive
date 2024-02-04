import { useAppSelector } from '../redux/store/store';
import { FileRow } from '../components/FileRow';
import { Loader } from '../components/Loader';
import { styled } from 'styled-components';

const LoaderContainer = styled.div`
	margin-top: 3%;
`;

export const FilesList = () => {
	const files = useAppSelector(state => state.files.files);
	const filesLoading = useAppSelector(state => state.files.requests.getFiles.loading);

	return filesLoading ? (
		<LoaderContainer>
			<Loader size={25} />
		</LoaderContainer>
	) : (
		<>
			{files.map((file, index) => (
				<FileRow key={index} file={file} />
			))}
		</>
	);
};
