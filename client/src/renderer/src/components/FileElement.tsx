import { styled } from 'styled-components';
import { useAppSelector } from '../redux/store/store';
import { FileType } from '../shared/types/global.types';

const ElementContainer = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	box-shadow: ${({ theme }) => theme.colors.boxShadow};
`;

const FileElementContainer = styled(ElementContainer)`
	height: 40px;
	width: 32px;
	min-width: 32px;
	border: 1px solid ${({ theme }) => theme.colors.border};
	border-radius: 10%;
	background-color: ${({ theme }) => theme.colors.backgroundSecondary};
`;

const FolderElementContainer = styled(ElementContainer)<{ $folderColor: string }>`
	z-index: 1;
	position: relative;
	height: 30px;
	width: 40px;
	min-width: 40px;
	background-color: ${({ $folderColor }) => $folderColor};
	border-radius: 0 4px 4px 4px;

	&:before {
		position: absolute;
		content: '';
		width: 20px;
		min-width: 20px;
		height: 5px;
		border-radius: 20px 20px 0 0;
		background-color: ${({ $folderColor }) => $folderColor};
		top: -5px;
		left: 0px;
	}
`;

const ExtensionText = styled.div`
	font-size: 11px;
	max-width: 30px;
	overflow-wrap: break-word;
	color: ${({ theme }) => theme.colors.textPrimary};
`;

interface IProps {
	extension?: string;
	type: FileType;
}

export const FileElement = ({ extension = '', type }: IProps): JSX.Element => {
	const themeMode = useAppSelector(state => state.settings.themeMode);
	const folderColor = themeMode === 'dark' ? '#3E4042' : 'darkgray';
	return type === FileType.Folder ? (
		<FolderElementContainer $folderColor={folderColor} />
	) : (
		<FileElementContainer>
			<ExtensionText>{extension}</ExtensionText>
		</FileElementContainer>
	);
};
