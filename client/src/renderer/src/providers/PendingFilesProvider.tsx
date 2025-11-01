import { createContext, useEffect, useState } from 'react';
import { Nullable, ServerSideEventProgressData } from '../shared/types/global.types';
import { toast } from 'react-toastify';

type PendingFile = ServerSideEventProgressData;

export interface PendingFilesContextType {
    downloadPendingFiles: PendingFile[];
    handleNewPendingFile: (file: PendingFile) => void;
    areFilesPending: boolean;
    currentFileDownloading: Nullable<PendingFile>;
    currentFileUploading: Nullable<PendingFile>;
}

export const PendingFilesContext = createContext<PendingFilesContextType | undefined>(undefined);

export const PendingFilesProvider = ({ children }: { children: React.ReactNode }) => {
    const [downloadPendingFiles, setDownloadPendingFiles] = useState<PendingFile[]>([]);
    const [currentFileDownloadingId, setCurrentFileDownloadingId] = useState<string>('');

    const [uploadPendingFiles, setUploadPendingFiles] = useState<PendingFile[]>([]);
    const [currentFileUploadingId, setCurrentFileUploadingId] = useState<string>('');

    useEffect(
        function updatePendingFiles() {
            downloadPendingFiles.forEach(f => {
                if (f.percentage === 100) {
                    setTimeout(() => {
                        // prevent duplicate toast pops
                        if (!toast.isActive(f.operationUuid)) {
                            toast.success('Download success: ' + f.name, {
                                toastId: f.operationUuid,
                            });
                        }

                        setDownloadPendingFiles(prevFiles =>
                            prevFiles.filter(prevF => prevF.operationUuid !== f.operationUuid)
                        );
                        setCurrentFileDownloadingId('');
                    }, 2000);
                }
            });
        },
        [downloadPendingFiles]
    );

    useEffect(
        function updatePendingFiles() {
            uploadPendingFiles.forEach(f => {
                if (f.percentage === 100) {
                    setTimeout(() => {
                        // prevent duplicate toast pops
                        if (!toast.isActive(f.operationUuid)) {
                            toast.success('Upload success: ' + f.name, {
                                toastId: f.operationUuid,
                            });
                        }

                        setUploadPendingFiles(prevFiles =>
                            prevFiles.filter(prevF => prevF.operationUuid !== f.operationUuid)
                        );
                        setCurrentFileUploadingId('');
                    }, 2000);
                }
            });
        },
        [uploadPendingFiles]
    );

    const handleNewPendingFile = (newPendingFile: PendingFile) => {
        const updatePendingFiles = (
            setPendingFiles: React.Dispatch<React.SetStateAction<PendingFile[]>>,
            setCurrentFileId: React.Dispatch<React.SetStateAction<string>>
        ) => {
            setPendingFiles(prevFiles => {
                const existingFile = prevFiles.find(
                    f =>
                        f.operationUuid === newPendingFile.operationUuid &&
                        f.driveId === newPendingFile.driveId
                );

                if (existingFile) {
                    return prevFiles.map(f =>
                        f.operationUuid === newPendingFile.operationUuid &&
                        f.driveId === newPendingFile.driveId
                            ? newPendingFile
                            : f
                    );
                }

                setCurrentFileId(newPendingFile.operationUuid);
                return [...prevFiles, newPendingFile];
            });
        };

        if (newPendingFile.type === 'download') {
            updatePendingFiles(setDownloadPendingFiles, setCurrentFileDownloadingId);
        } else if (newPendingFile.type === 'upload') {
            updatePendingFiles(setUploadPendingFiles, setCurrentFileUploadingId);
        }
    };

    return (
        <PendingFilesContext.Provider
            value={{
                downloadPendingFiles,
                handleNewPendingFile,
                areFilesPending: downloadPendingFiles.some(f => f.percentage > 0),
                currentFileDownloading:
                    downloadPendingFiles.find(f => f.operationUuid === currentFileDownloadingId) ??
                    null,
                currentFileUploading:
                    uploadPendingFiles.find(f => f.operationUuid === currentFileUploadingId) ??
                    null,
            }}
        >
            {children}
        </PendingFilesContext.Provider>
    );
};
