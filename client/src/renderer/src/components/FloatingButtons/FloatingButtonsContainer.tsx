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
import { useCreateDriveFileMutation, useUploadDriveFileMutation } from '../../redux/rtk/driveApi';

const Container = styled.div`
    position: absolute;
    bottom: 50px;
    right: 50px;
`;

const FileOpenerInput = styled.input`
    display: none;
`;

export const FloatingButtonsContainer = (): JSX.Element => {
    const dispatch = useAppDispatch();
    const { folderId, driveId } = useParams();
    const [menuOpen, setMenuOpen] = useState(false);
    const [plusButtonAnimation, setPlusButtonAnimation] = useState<Keyframes>();
    const theme = useTheme();
    const [uploadDriveFile] = useUploadDriveFileMutation();
    const [createDriveFile, { isLoading: createDriveFileLoading }] = useCreateDriveFileMutation();

    const uploaderRef = useRef<Nullable<HTMLInputElement>>(null);

    const openFloatingMenu = (): void => {
        setPlusButtonAnimation(menuOpen ? rotate45degBackwards : rotate45deg);
        setMenuOpen(prevMenuOpen => !prevMenuOpen);
    };

    const openFilePicker = (): void => {
        uploaderRef.current?.click();
    };

    const onFileLoad = (): void => {
        if (!folderId || !driveId) {
            return;
        }

        const file = uploaderRef.current?.files?.[0];

        if (file) {
            uploadDriveFile({ driveId, parentFolderId: folderId, file });
        }
    };

    const onAddFolderClick = async () => {
        if (folderId && driveId) {
            createDriveFile({ driveId, parentFolderId: folderId, fileType: FileType.Folder });
        } else {
            dispatch(
                openModal({
                    kind: ModalKind.Upload,
                    state: { fileType: FileType.Folder },
                })
            );
        }
    };

    const onAddFileClick = async () => {
        if (folderId && driveId) {
            openFilePicker();
        } else {
            dispatch(
                openModal({
                    kind: ModalKind.Upload,
                    state: { fileType: FileType.File },
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
                        onClick={onAddFileClick}
                        animation={slideUp70pxAnimation}
                    >
                        <FileOpenerInput
                            type='file'
                            id='file'
                            ref={uploaderRef}
                            onChange={onFileLoad}
                        />
                    </FloatingButton>
                    <FloatingButton
                        icon={SvgNames.AddFolder}
                        color={theme?.colors.red ?? ''}
                        animation={slideUp40pxAnimation}
                        onClick={onAddFolderClick}
                        isLoading={createDriveFileLoading}
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
