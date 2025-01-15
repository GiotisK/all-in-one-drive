import { useRef, useState } from 'react';
import { FileElement } from './FileElement';
import { SvgNames } from '../shared/utils/svg-utils';
import { CreateDriveSvg, isNativeGoogleDriveFile } from '../shared/utils/utils';
import { IconButton } from './IconButton';
import { styled, useTheme } from 'styled-components';
import { useOutsideClicker } from '../hooks';
import { DriveType, FileEntity, FileType } from '../shared/types/global.types';
import { openModal } from '../redux/slices/modal/modalSlice';
import { ModalKind } from '../redux/slices/modal/types';
import { useAppDispatch } from '../redux/store/store';
import { useNavigate } from 'react-router-dom';
import { Loader } from './Loader';
import { toast } from 'react-toastify';
import DrivesFilesService from '../services/drives/files/drives.files.service';
import {
	useDownloadDriveFileMutation,
	useGetGoogleDriveFileExportFormatsQuery,
	useShareDriveFileMutation,
} from '../redux/rtk/driveApi';

const Container = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
	margin-left: 10px;
	padding: 10px 0 10px 10px;
	border-bottom: solid 0.5px ${({ theme }) => theme.colors.border};
`;

const ColumnBase = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
	align-items: center;
`;

const FirstColumn = styled(ColumnBase)`
	cursor: pointer;
	width: 40%;
`;

const SecondColumn = styled(ColumnBase)`
	width: 20%;
`;

const ThirdColumn = styled(ColumnBase)`
	width: 10%;
`;

const FourthColumn = styled(ColumnBase)`
	width: 20%;
`;

const Text = styled.p`
	margin: 0;
	margin-left: 2%;
	width: 90%;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	font-size: 16px;
	margin-right: 5%;
	color: ${({ theme }) => theme.colors.textPrimary};
`;

const PopupMenu = styled.div`
	position: absolute;
	z-index: 1;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	width: 100px;
	top: 30px;
	right: 0px;
	border: 1px solid ${({ theme }) => theme.colors.border};
	border-radius: 5px;
	color: ${({ theme }) => theme.colors.textPrimary};
	background-color: ${({ theme }) => theme.colors.background};
	box-shadow: ${({ theme }) => theme.colors.boxShadow}};
`;

const MenuRow = styled.button`
	border: none;
	border-bottom: solid 1px ${({ theme }) => theme.colors.border};
	background: none;
	color: inherit;
	padding: 0;
	font: inherit;
	cursor: pointer;
	outline: inherit;

	&:disabled {
		color: ${({ theme }) => theme.colors.textSecondary};
	}
`;

const MenuRowText = styled.p`
	flex-grow: 1;
	margin: 0;
	padding: 3% 3% 3% 5%;
	border-radius: 4px;

	&:hover {
		background-color: ${({ theme }) => theme.colors.blueSecondary};
		cursor: pointer;
	}
`;

const LoaderContainer = styled.div`
	margin-left: 5px;
	margin-top: 5px;
`;

interface IProps {
	file: FileEntity;
}

type FileMenuRow = {
	text: string;
	disabled?: boolean;
	onClick: () => void;
};

export const FileRow = ({ file }: IProps): JSX.Element => {
	const theme = useTheme();
	const navigate = useNavigate();
	const dispatch = useAppDispatch();

	const [menuToggle, setMenuToggle] = useState(false);
	const menuRef = useRef(null);
	const menuTriggerRef = useRef(null);

	const { driveId, id, type, extension, date, drive, email, name, size, sharedLink } = file;
	const isGoogleDriveFile = isNativeGoogleDriveFile(extension);

	const { data: formats = [], isLoading: exportFormatsLoading } =
		useGetGoogleDriveFileExportFormatsQuery(
			{
				driveId,
				fileId: id,
			},
			{ skip: !isGoogleDriveFile || !menuToggle }
		);
	const [shareDriveFile, { isLoading: shareDriveFileLoading }] = useShareDriveFileMutation();
	const [downloadDriveFile] = useDownloadDriveFileMutation();

	useOutsideClicker(menuRef, menuTriggerRef, () => setMenuToggle(false));

	const onDeleteClick = () => {
		dispatch(openModal({ kind: ModalKind.Delete, state: { entity: file } }));
	};

	const onRenameClick = () => {
		dispatch(openModal({ kind: ModalKind.Rename, state: { entity: file } }));
	};

	const onShareClick = async () => {
		shareDriveFile({ driveId, fileId: id, share: true });
	};

	const onUnshareClick = async () => {
		shareDriveFile({ driveId, fileId: id, share: false });
	};

	const onFileClick = async () => {
		if (type === FileType.Folder) {
			navigate(`${driveId}/${id}`);
		} else if (type === FileType.File) {
			try {
				await DrivesFilesService.openDriveFile(driveId, id);
				toast.success('File opening initiated successfully');
			} catch {
				toast.error('Failed to open file');
			}
		}
	};

	const onDownloadClick = () => {
		if (file.drive === DriveType.GoogleDrive && file.type === FileType.Folder) {
			toast.error('Cannot download folder from Google Drive');
			return;
		}

		toast.info('File downloading initiated...');

		downloadDriveFile({ driveId, fileId: id });
	};

	const onExportClick = async () => {
		dispatch(
			openModal({
				kind: ModalKind.ExportFormat,
				state: { exportFormats: formats, fileId: id, driveId },
			})
		);
	};

	const fileMenuRows: FileMenuRow[] = [
		{
			text: isGoogleDriveFile ? 'Export' : 'Download',
			onClick: isGoogleDriveFile ? onExportClick : onDownloadClick,
			disabled: exportFormatsLoading,
		},
		{
			text: 'Rename',
			onClick: onRenameClick,
		},
		{
			text: sharedLink ? 'Unshare' : 'Share Publicly',
			onClick: sharedLink ? onUnshareClick : onShareClick,
		},
		{
			text: 'Delete',
			onClick: onDeleteClick,
		},
	];

	const filemenu = (
		<IconButton
			triggerRef={menuTriggerRef}
			icon={SvgNames.Dots}
			size={22}
			color={theme?.colors.textSecondary}
			style={{ position: 'relative' }}
			onClick={() => {
				setMenuToggle(!menuToggle);
			}}
		>
			{menuToggle && (
				<PopupMenu ref={menuRef}>
					{fileMenuRows.map((row, index) => (
						<MenuRow disabled={row.disabled} key={index} onClick={row.onClick}>
							<MenuRowText>{row.text}</MenuRowText>
						</MenuRow>
					))}
				</PopupMenu>
			)}
		</IconButton>
	);

	return (
		<Container>
			<FirstColumn onClick={onFileClick}>
				<FileElement type={type} extension={extension} />
				<Text>{name}</Text>
			</FirstColumn>
			<SecondColumn>
				{CreateDriveSvg(drive)}
				<Text>{email}</Text>
			</SecondColumn>
			<ThirdColumn>
				<Text>{size}</Text>
			</ThirdColumn>
			<FourthColumn>
				<Text>{date}</Text>
				{filemenu}
			</FourthColumn>

			{sharedLink && (
				<IconButton
					icon={SvgNames.Link}
					color={theme?.colors.green}
					size={20}
					onClick={() => navigator.clipboard.writeText(sharedLink)}
				/>
			)}

			{(exportFormatsLoading || shareDriveFileLoading) && (
				<LoaderContainer>
					<Loader size={8} />
				</LoaderContainer>
			)}
		</Container>
	);
};
