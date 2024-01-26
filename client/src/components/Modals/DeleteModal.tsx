import { BaseModal } from './BaseModal';
import { Entity, FileType } from '../../shared/types/types';
import { CreateDriveSvg } from '../../shared/utils/utils';
import { styled } from 'styled-components';
import { DriveEntity, DriveType, FileEntity } from '../../shared/types/global.types';
import { DeleteModalState } from '../../redux/slices/modal/types';
import { deleteDriveEntity } from '../../services/drives/drives.service';
import { useDispatch } from 'react-redux';
import { deleteDrive } from '../../redux/slices/drives/drivesSlice';
import { closeModals } from '../../redux/slices/modal/modalSlice';
import { deleteFile } from '../../redux/slices/files/filesSlice';
import { deleteDriveFile } from '../../services/drives/files/drives.files.service';

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
	const dispatch = useDispatch();
	const { entity } = state;

	const sendDeleteDriveRequest = async () => {
		if (!entity) return;

		if (isDriveEntity(entity)) {
			const { email, type } = entity;
			const success = await deleteDriveEntity(email, type);
			success && dispatch(deleteDrive(entity));
			dispatch(closeModals());
		} else if (isFileEntity(entity)) {
			const { drive, email, id } = entity;
			const success = await deleteDriveFile(drive, email, id);
			success && dispatch(deleteFile(id));
			dispatch(closeModals());
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
					onClick: sendDeleteDriveRequest,
				},
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
