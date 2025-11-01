import styled, { keyframes } from 'styled-components';
import { usePendingFilesContext } from '../hooks/usePendingFilesContext';
import { FileOperationType } from '../shared/types/global.types';

const slideInFromBottom = keyframes`
	0% {
		transform: translateY(20px);
		opacity: 0;
	}
	100% {
		transform: translateY(0);
		opacity: 1;
	}
`;

const slideOutToBottom = keyframes`
	0% {
		transform: translateY(0);
		opacity: 1;
	}
	100% {
		transform: translateY(20px);
		opacity: 0;
	}
`;

const LoadingBarContainer = styled.div<{ type: FileOperationType }>`
    width: 400px;
    height: 20px;
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: 4px;
    position: absolute;
    right: 17px;
    bottom: ${({ type }) => (type === 'upload' ? '25px' : '0px')};
    background-color: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.textPrimary};
    animation: ${slideInFromBottom} 0.5s ease-in-out forwards;

    &.slide-out {
        animation: ${slideOutToBottom} 0.5s ease-in-out forwards;
    }
`;

const RelativeContainer = styled.div`
    position: relative;
`;

const ProgressBar = styled.div<{ type: FileOperationType }>`
    height: 20px;
    border-radius: 4px;
    background-color: ${({ theme, type }) =>
        type === 'upload' ? theme.colors.bluePrimary : theme.colors.green};
    white-space: nowrap;
`;

const ProgressText = styled.p`
    margin: 0;
    margin-left: 10px;
    font-size: 13px;
`;

export const LoadingBar = () => {
    const { currentFileDownloading, currentFileUploading } = usePendingFilesContext();

    return (
        <>
            {currentFileUploading && (
                <LoadingBarContainer type='upload'>
                    <RelativeContainer>
                        <ProgressBar
                            type='upload'
                            style={{ width: (400 * currentFileUploading.percentage) / 100 }}
                        >
                            <ProgressText>
                                Uploading {currentFileUploading.percentage}% -{' '}
                                {currentFileUploading.name}
                            </ProgressText>
                        </ProgressBar>
                    </RelativeContainer>
                </LoadingBarContainer>
            )}

            {currentFileDownloading && (
                <LoadingBarContainer type='download'>
                    <RelativeContainer>
                        <ProgressBar
                            type='download'
                            style={{ width: (400 * currentFileDownloading.percentage) / 100 }}
                        >
                            <ProgressText>
                                Downloading {currentFileDownloading.percentage}% -{' '}
                                {currentFileDownloading.name}
                            </ProgressText>
                        </ProgressBar>
                    </RelativeContainer>
                </LoadingBarContainer>
            )}
        </>
    );
};
