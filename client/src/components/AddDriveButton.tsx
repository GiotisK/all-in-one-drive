import { styled } from 'styled-components';
import { CreateDriveSvg } from '../shared/utils/utils';
import { DriveType } from '../shared/types/global.types';

interface IProps {
	type: DriveType;
	onClick?: () => void;
}

const Container = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	border: 1px solid ${props => props.theme.colors.border};
	border-radius: 8px;
	box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
	cursor: pointer;
	user-select: none;
	transition: all 0.2s ease;
	background-color: ${props => props.theme.colors.background};
	width: 130px;
	height: 130px;

	&:active {
		opacity: 70%;
		width: 130px;
		height: 130px;
	}

	&:hover {
		transform: scale(1.05);
		-webkit-transform: scale(1.05);
		-ms-transform: scale(1.05);
	}
`;

const Text = styled.p`
	font-weight: 600;
	color: ${props => props.theme.colors.textPrimary};
	fontsize: '17px';
`;

export const AddDriveButton = (props: IProps): JSX.Element => {
	const getDriveName = (): string => {
		switch (props.type) {
			case DriveType.GoogleDrive:
				return 'Google Drive';
			case DriveType.Dropbox:
				return 'Dropbox';
			case DriveType.OneDrive:
				return 'OneDrive';
			default:
				return 'Unknown Drive';
		}
	};
	return (
		<Container onClick={props.onClick}>
			{CreateDriveSvg(props.type, 50)}
			<Text>{getDriveName()}</Text>
		</Container>
	);
};
