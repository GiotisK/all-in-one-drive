import { useState, useRef } from 'react';
import styled, { useTheme } from 'styled-components';
import FloatingButton from './FloatingButton';
import { SvgNames } from '../../shared/utils/svg-utils';
import { Keyframes } from 'styled-components/dist/types';
import {
	rotate45deg,
	rotate45degBackwards,
	slideUp40pxAnimation,
	slideUp70pxAnimation,
} from './animation-keyframes';
import { FileType, Nullable } from '../../shared/types/global.types';
import { useAppDispatch } from '../../redux/store/store';
import { openModal } from '../../redux/slices/modal/modalSlice';
import { ModalKind } from '../../redux/slices/modal/types';
import { useParams } from 'react-router-dom';
import { createFolder } from '../../redux/async-actions/files.async.actions';

const Container = styled.div`
	position: absolute;
	bottom: 5%;
	right: 5%;
`;

const FileOpenerInput = styled.input`
	display: none;
`;

export const FloatingButtonsContainer = (): JSX.Element => {
	const dispatch = useAppDispatch();
	const { folderId, driveId } = useParams();
	const [menuOpen, setMenuOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [plusButtonAnimation, setPlusButtonAnimation] = useState<Keyframes>();
	const theme = useTheme();

	const uploaderRef = useRef<Nullable<HTMLInputElement>>(null);

	const openFloatingMenu = (): void => {
		setPlusButtonAnimation(menuOpen ? rotate45degBackwards : rotate45deg);
		setMenuOpen(prevMenuOpen => !prevMenuOpen);
	};

	const openFilePicker = (): void => {
		uploaderRef.current?.click();
	};

	const uploadFile = (): void => {
		//TODO: upload file here
		console.log('upload file');
	};

	const onAddFolderClick = async () => {
		if (folderId && driveId) {
			try {
				setIsLoading(true);
				await dispatch(createFolder({ driveId, parentFolderId: folderId }));
				setIsLoading(false);
			} catch {
				setIsLoading(false);
				//TODO: show toast
			}
		} else {
			dispatch(
				openModal({
					kind: ModalKind.Upload,
					state: { fileType: FileType.Folder },
				})
			);
		}
	};

	return (
		<Container>
			{menuOpen && (
				<>
					<FloatingButton
						color={theme?.colors.orange ?? 'orange'}
						icon={SvgNames.AddFile}
						onClick={openFilePicker}
						animation={slideUp70pxAnimation}
					>
						<FileOpenerInput
							type='file'
							id='file'
							ref={uploaderRef}
							onChange={uploadFile}
						/>
					</FloatingButton>
					<FloatingButton
						icon={SvgNames.AddFolder}
						color={theme?.colors.red ?? ''}
						animation={slideUp40pxAnimation}
						onClick={onAddFolderClick}
						isLoading={isLoading}
					/>
				</>
			)}

			<FloatingButton
				icon={SvgNames.Plus}
				color={`${theme?.colors.bluePrimary ?? ''}`}
				onClick={openFloatingMenu}
				animation={plusButtonAnimation}
			/>
		</Container>
	);
};
