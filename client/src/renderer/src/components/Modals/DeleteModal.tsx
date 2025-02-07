import { BaseModal } from './BaseModal';
import { Entity } from '../../shared/types/types';
import { CreateDriveSvg } from '../../shared/utils/utils';
import { styled } from 'styled-components';
import { DriveEntity, DriveType, FileEntity, FileType } from '../../shared/types/global.types';
import { DeleteModalState } from '../../redux/slices/modal/types';
import { closeModals } from '../../redux/slices/modal/modalSlice';
import { useAppDispatch } from '../../redux/store/store';
import { toast } from 'react-toastify';
import { useDeleteDriveMutation, useDeleteFileMutation } from '../../redux/rtk/driveApi';
import { useEffect } from 'react';

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
	const [deleteFile, { isLoading: deleteFileLoading, isSuccess: deleteFileSuccesss }] =
		useDeleteFileMutation();
	const [deleteDrive, { isLoading: deleteDriveLoading, isSuccess: deleteDriveSuccess }] =
		useDeleteDriveMutation();
	const { entity } = state;

	useEffect(() => {
		if (deleteFileSuccesss || deleteDriveSuccess) {
			toast.success('Deleted successfully');
			dispatch(closeModals());
		}
	}, [deleteDriveSuccess, deleteFileSuccesss, dispatch]);

	const sendDeleteEntityRequest = async () => {
		if (!entity) return;
		if (isDriveEntity(entity)) {
			const { id: driveId } = entity;
			deleteDrive({ driveId });
		} else if (isFileEntity(entity)) {
			const { driveId, id: fileId } = entity;
			deleteFile({ driveId, fileId });
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
				showLoader: deleteDriveLoading || deleteFileLoading,
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
