import { styled } from 'styled-components';
import { CreateDriveSvg } from '../../shared/utils/utils';
import { BaseModal } from './BaseModal';
import { DriveEntity, FileType, Nullable } from '../../shared/types/global.types';
import { UploadModalState } from '../../redux/slices/modal/types';
import { useAppDispatch } from '../../redux/store/store';
import { closeModals } from '../../redux/slices/modal/modalSlice';
import { toast } from 'react-toastify';
import { useEffect, useRef, useState } from 'react';
import {
	useCreateDriveFileMutation,
	useGetDrivesQuery,
	useUploadDriveFileMutation,
} from '../../redux/rtk/driveApi';

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

const FileOpenerInput = styled.input`
	display: none;
`;

interface IProps {
	state: UploadModalState;
}

export const UploadModal = ({ state }: IProps): JSX.Element => {
	const dispatch = useAppDispatch();
	const uploaderRef = useRef<Nullable<HTMLInputElement>>(null);
	const { fileType, droppedFile } = state;
	const [selectedDrive, setSelectedDrive] = useState<Nullable<DriveEntity>>(null);
	const { data: drives = [] } = useGetDrivesQuery();
	const [uploadDriveFile] = useUploadDriveFileMutation();
	const [
		createDriveFile,
		{ isLoading: createDriveFileLoading, isSuccess: createDriveFileSuccess },
	] = useCreateDriveFileMutation();

	useEffect(() => {
		if (createDriveFileSuccess) {
			toast.success('Folder created successfully');
		}
	}, [createDriveFileSuccess]);

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
		const { id: driveId } = drive;
		setSelectedDrive(drive);

		if (droppedFile) {
			triggerFileUpload(drive, droppedFile);
			return;
		}

		if (fileType === FileType.File) {
			openFilePicker();
		} else if (fileType === FileType.Folder) {
			createDriveFile({ driveId, fileType: FileType.Folder });
			dispatch(closeModals());
		}
	};

	const triggerFileUpload = (selectedDrive: DriveEntity, file: File) => {
		toast.info('File uploading initiated...');
		uploadDriveFile({ driveId: selectedDrive.id, file });
		dispatch(closeModals());
	};

	const openFilePicker = (): void => {
		uploaderRef.current?.click();
	};

	const onFileLoad = (): void => {
		const file = uploaderRef.current?.files?.[0];

		if (file && selectedDrive) {
			triggerFileUpload(selectedDrive, file);
		}
	};

	return (
		<BaseModal
			footerProps={{ showLoader: createDriveFileLoading }}
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
				<FileOpenerInput type='file' ref={uploaderRef} onChange={onFileLoad} />
			</Content>
		</BaseModal>
	);
};
