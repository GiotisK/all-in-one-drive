import { BaseModal } from './BaseModal';
import { Entity } from '../../shared/types/types';
import { CreateDriveSvg } from '../../shared/utils/utils';
import { styled } from 'styled-components';
import { DriveEntity, DriveType, FileEntity, FileType } from '../../shared/types/global.types';
import { DeleteModalState } from '../../redux/slices/modal/types';
import { closeModals } from '../../redux/slices/modal/modalSlice';
import { useAppDispatch, useAppSelector } from '../../redux/store/store';
import { deleteDrive } from '../../redux/async-actions/drives.async.actions';
import { deleteFile } from '../../redux/async-actions/files.async.actions';

interface DeleteFileProps {
	file: FileEntity;
}

interface DeleteDriveProps {
	drive: DriveEntity;
}

const BoldSpan = styled.span`
	font-weight: bold;
	color: ${({ theme }) => theme.colors.textPrimary};
`;

const SvgContainer = styled.span`
	display: inline-block;
	verticalalign: middle;
`;

const Content = styled.div`
	display: flex;
	flex-direction: column;
	height: 100px;
	width: 500px;
`;

const ConfirmationText = styled.div`
	flex: 1;
	margin: 0 5%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	color: ${({ theme }) => theme.colors.textPrimary};
`;

const DeleteFileText = ({ file }: DeleteFileProps): JSX.Element => {
	return <BoldSpan> file "{file.name}" ?</BoldSpan>;
};

const DeleteDriveText = ({ drive }: DeleteDriveProps): JSX.Element => {
	return (
		<>
			<SvgContainer>{CreateDriveSvg(drive.type, 25)}</SvgContainer>
			<BoldSpan> drive </BoldSpan> associated with
			<BoldSpan> "{drive.email}" ?</BoldSpan>
		</>
	);
};

interface IProps {
	state: DeleteModalState;
}

export const DeleteModal = ({ state }: IProps): JSX.Element => {
	const dispatch = useAppDispatch();
	const deleteDriveReq = useAppSelector(state => state.drives.requests.deleteDrive);
	const deleteFileReq = useAppSelector(state => state.files.requests.deleteFile);

	const { entity } = state;

	const sendDeleteEntityRequest = async () => {
		if (!entity) return;
		try {
			if (isDriveEntity(entity)) {
				const { id: driveId } = entity;
				await dispatch(deleteDrive({ driveId }));
			} else if (isFileEntity(entity)) {
				const { driveId, id: fileId } = entity;
				await dispatch(deleteFile({ driveId, fileId }));
			}
			dispatch(closeModals());
		} catch {
			//TODO: show toast
		}
	};

	return (
		<BaseModal
			headerProps={{ title: 'Delete' }}
			footerProps={{
				leftButton: {
					text: 'Cancel',
				},
				rightButton: {
					text: 'Delete',
					onClick: sendDeleteEntityRequest,
				},
				showLoader: deleteDriveReq.loading || deleteFileReq.loading,
			}}
		>
			<Content>
				<ConfirmationText>
					<span>
						<span>Are you sure you want to delete the </span>
						{entity && isFileEntity(entity) && <DeleteFileText file={entity} />}
						{entity && isDriveEntity(entity) && <DeleteDriveText drive={entity} />}
					</span>
				</ConfirmationText>
			</Content>
		</BaseModal>
	);
};

const isFileEntity = (entity: Entity): entity is FileEntity => {
	return Object.values(FileType).includes(entity.type as FileType);
};

const isDriveEntity = (entity: Entity): entity is DriveEntity => {
	return Object.values(DriveType).includes(entity.type as DriveType);
};
