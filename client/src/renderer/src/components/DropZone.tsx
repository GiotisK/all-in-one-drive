import { PropsWithChildren, useState } from 'react';
import { styled } from 'styled-components';
import { SvgNames, createSvg } from '../shared/utils/svg-utils';
import { useParams } from 'react-router-dom';
import { useIsInsideFolder } from '../hooks/useIsInsideFolder';
import { useUploadDriveFileMutation } from '../redux/rtk/driveApi';
import { useAppDispatch } from '../redux/store/store';
import { openModal } from '../redux/slices/modal/modalSlice';
import { ModalKind } from '../redux/slices/modal/types';
import { FileType } from '../shared/types/global.types';

const Container = styled.div`
	display: flex;
	flex: 1;
	flex-direction: column;
	background-color: ${({ theme }) => theme.colors.background};
`;

const DropIndicator = styled.div`
	z-index: 2;
	position: absolute;
	left: 50%;
	top: 8%;
	pointer-events: none;
`;

const SvgContainer = styled.div`
	padding-left: 25%;
	margin-bottom: 5%;
`;

const TextContainer = styled.div`
	margin-top: 2px;
	background-color: ${({ theme }) => theme.colors.background};
	border: 1px solid ${({ theme }) => theme.colors.border};
	border-radius: 5px;
	box-shadow: ${({ theme }) => theme.colors.boxShadow};
`;

const Text = styled.p`
	margin: 0;
	padding: 1px;
	font-size: 20px;
	color: ${({ theme }) => theme.colors.textPrimary};
`;

const DropZoneBackdrop = styled.div`
	position: fixed;
	display: flex;
	z-index: 1;
	height: 100%;
	width: 100%;
	background-color: rgba(0, 0, 0, 0.5);
	pointer-events: none;
`;

const ContainerId = 'dropzonecontainer';

export const DropZone = ({ children }: PropsWithChildren) => {
	const [isDragging, setIsDragging] = useState(false);
	const { folderId, driveId } = useParams();
	const isInsideFolder = useIsInsideFolder();
	const [uploadDriveFile] = useUploadDriveFileMutation();
	const dispatch = useAppDispatch();

	let storedTarget: EventTarget | null = null;

	const handleDragStart = (event: React.DragEvent<HTMLDivElement>) => {
		event.preventDefault();
		event.stopPropagation();
	};

	const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
		event.preventDefault();
		event.stopPropagation();
	};

	const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
		event.preventDefault();
		event.stopPropagation();
		if (event.currentTarget.id === ContainerId) {
			storedTarget = event.currentTarget;
			setIsDragging(true);
		}
	};

	const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
		event.stopPropagation();
		event.preventDefault();
		if (storedTarget === event.target) {
			storedTarget = null;
			setIsDragging(false);
		}
	};

	const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
		event.preventDefault();
		setIsDragging(false);

		if (!event.dataTransfer.files.length) {
			return;
		}

		if (isInsideFolder && driveId && folderId) {
			uploadDriveFile({
				driveId: driveId,
				parentFolderId: folderId,
				file: event.dataTransfer.files[0],
			});
			return;
		} else {
			dispatch(
				openModal({
					kind: ModalKind.Upload,
					state: { fileType: FileType.File, droppedFile: event.dataTransfer.files[0] },
				})
			);
		}
	};

	return (
		<Container
			id={ContainerId}
			onDrop={handleDrop}
			onDragStart={handleDragStart}
			onDragEnter={handleDragEnter}
			onDragOver={handleDragOver}
			onDragLeave={handleDragLeave}
		>
			{children}
			{isDragging && (
				<>
					<DropZoneBackdrop />
					<DropIndicator>
						<SvgContainer>{createSvg(SvgNames.HandDown, 50, 'white')}</SvgContainer>
						<TextContainer>
							<Text>Drop file(s)</Text>
						</TextContainer>
					</DropIndicator>
				</>
			)}
		</Container>
	);
};
