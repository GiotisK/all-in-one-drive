import { styled } from 'styled-components';
import { CreateDriveSvg } from '../../shared/utils/utils';
import { BaseModal } from './BaseModal';
import { DriveEntity, FileType } from '../../shared/types/global.types';
import { UploadModalState } from '../../redux/slices/modal/types';
import { useAppDispatch, useAppSelector } from '../../redux/store/store';
import { createFolder } from '../../redux/async-actions/files.async.actions';
import { closeModals } from '../../redux/slices/modal/modalSlice';

const Content = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
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
	min-height: 30px;
	max-height: 200px;
	flex-direction: column;
	overflow-y: auto;
	margin-bottom: 20px;
`;

const DriveRow = styled.div`
	display: flex;
	align-self: center;
	margin-top: 10px;
	height: 30px;
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
	const dispatch = useAppDispatch();
	const drives = useAppSelector(state => state.drives.drives);
	const createFolderReq = useAppSelector(state => state.files.requests.createFolder);
	const { fileType } = state;

	const getTitle = (): string => {
		switch (fileType) {
			case FileType.File:
				return 'Select a drive to upload the file';
			case FileType.Folder:
				return 'Select a drive to create the folder';
			default:
				console.log('Wrong fileType supplied with value: ', fileType);
				return '';
		}
	};

	const onDriveClick = async (drive: DriveEntity) => {
		const { type, email } = drive;
		try {
			await dispatch(createFolder({ drive: type, email }));
			dispatch(closeModals());
		} catch {
			//TODO: show modal
		}
	};

	return (
		<BaseModal
			footerProps={{ showLoader: createFolderReq.loading }}
			headerProps={{ title: getTitle() }}
		>
			<Content>
				{drives.length === 0 ? (
					<NoDrivesText>No drives found...</NoDrivesText>
				) : (
					<DriveRowScrollView>
						{drives.map((drive, index) => (
							<DriveRow
								key={index}
								onClick={() => {
									onDriveClick(drive);
								}}
							>
								{CreateDriveSvg(drive.type, 25)}
								<DriveRowText>{drive.email}</DriveRowText>
							</DriveRow>
						))}
					</DriveRowScrollView>
				)}
			</Content>
		</BaseModal>
	);
};
