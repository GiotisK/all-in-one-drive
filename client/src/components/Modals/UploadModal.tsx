import { styled } from 'styled-components';
import { FileType } from '../../shared/types/types';
import { CreateDriveSvg } from '../../shared/utils/utils';
import { BaseModal } from './BaseModal';
import { DriveEntity, DriveType } from '../../shared/types/global.types';
import { UploadModalState } from '../../redux/slices/modal/types';

const Content = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	height: 200px;
	width: 500px;
`;

const NoDrivesText = styled.p`
	font-size: 20px;
	color: gray;
	display: flex;
	flex: 1;
	align-items: center;
`;

const DriveRowScrollView = styled.div`
	display: flex;
	flex: 1;
	width: 90%;
	height: 300px;
	flex-direction: column;
	overflow-y: auto;
	margin-bottom: 20px;
`;

const DriveRow = styled.div`
	display: flex;
	align-self: center;
	margin-top: 10px;
	height: 80px;
	width: 100%;
	flex-direction: row;
	align-items: center;
	vertical-align: baseline;
	border-bottom: 1px solid ${({ theme }) => theme.colors.border};
	user-select: none;
	cursor: pointer;
	border-radius: 4px;
	padding: 5px 0px;

	&:hover {
		background-color: ${({ theme }) => theme.colors.blueSecondary};
	}
`;

const DriveRowText = styled.p`
	margin: 0;
	margin-left: 5px;
	margin-bottom: -1%;
	overflow: hidden;
	color: ${({ theme }) => theme.colors.textPrimary};
	word-wrap: break-word;
`;

interface IProps {
	state: UploadModalState;
}

export const UploadModal = ({ state }: IProps): JSX.Element => {
	const { fileType } = state;

	const drives: DriveEntity[] = [
		/* { email: 'malaris@polaris.kek', type: DriveType.GoogleDrive },
		{ email: 'malaris@polaris.kek', type: DriveType.GoogleDrive },
		{ email: 'malaris@polaris.kek', type: DriveType.GoogleDrive },
		{ email: 'malaris@polaris.kek', type: DriveType.GoogleDrive },
		{ email: 'malaris@polaris.kek', type: DriveType.GoogleDrive }, */
	];

	let title = '';
	switch (fileType) {
		case FileType.File:
			title = 'Selected a drive to upload the file';
			break;
		case FileType.Folder:
			title = 'Selected a drive to create the folder';
			break;
	}

	return (
		<BaseModal headerProps={{ title }}>
			<Content>
				{drives.length === 0 ? (
					<NoDrivesText>No drives found...</NoDrivesText>
				) : (
					<DriveRowScrollView>
						{drives.map((drive, index) => (
							<DriveRow
								key={index}
								className='drive-row'
								onClick={() => {
									console.log('drivw row clicked');
									/* props.onSpecificRowClick(drive); */
								}}
							>
								{CreateDriveSvg(drive.type, 25)}
								<DriveRowText className='drive-row-email-text'>
									{drive.email}
								</DriveRowText>
							</DriveRow>
						))}
					</DriveRowScrollView>
				)}
			</Content>
		</BaseModal>
	);
};
