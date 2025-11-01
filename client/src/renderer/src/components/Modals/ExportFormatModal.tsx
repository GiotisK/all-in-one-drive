import { styled } from 'styled-components';
import { BaseModal } from './BaseModal';
import { ExportFormatModalState } from '../../redux/slices/modal/types';
import mime from 'mime';
import { useExportGoogleDriveFileMutation } from '../../redux/rtk/driveApi';
import { useAppDispatch } from '../../redux/store/store';
import { closeModals } from '../../redux/slices/modal/modalSlice';
import { toast } from 'react-toastify';

const FormatButtonsContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    flex-wrap: wrap;
    align-items: center;
    max-width: 500px;
    gap: 30px;
    max-height: 500px;
    padding: 10px 20px;
`;

const FormatButton = styled.button`
    all: unset;
    cursor: pointer;
    border: 1px solid ${({ theme }) => theme.colors.border};
    height: 50px;
    text-align: center;
    font-size: 12px;
    border-radius: 5px;
    box-shadow: ${({ theme }) => theme.colors.boxShadow};
    color: ${({ theme }) => theme.colors.textPrimary};
    background-color: ${({ theme }) => theme.colors.backgroundSecondary};
    transition: transform 0.2s ease-in-out;
    padding: 0px 10px;

    &:hover {
        transform: scale(1.1);
    }
`;

interface IProps {
    state: ExportFormatModalState;
}

export const ExportFormatModal = ({ state }: IProps) => {
    const dispatch = useAppDispatch();
    const [exportGoogleDriveFile] = useExportGoogleDriveFileMutation();
    const { exportFormats } = state;

    const onExportClick = async (mimeType: string) => {
        exportGoogleDriveFile({ driveId: state.driveId, fileId: state.fileId, mimeType });
        dispatch(closeModals());
        toast.info('File export initiated...');
    };

    return (
        <BaseModal headerProps={{ title: 'Export as:' }}>
            <FormatButtonsContainer>
                {exportFormats.map((format, index) => (
                    <FormatButton
                        key={index}
                        onClick={() => {
                            onExportClick(format);
                        }}
                    >
                        {mime.getExtension(format) ?? format}
                    </FormatButton>
                ))}
            </FormatButtonsContainer>
        </BaseModal>
    );
};
