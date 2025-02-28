import { createContext, useEffect, useState } from 'react';
import { Nullable, ServerSideEventProgressData } from '../shared/types/global.types';
import { toast } from 'react-toastify';

type PendingFile = ServerSideEventProgressData;

export interface PendingFilesContextType {
	downloadPendingFiles: PendingFile[];
	handleNewPendingFile: (file: PendingFile) => void;
	areFilesPending: boolean;
	currentFileDownloading: Nullable<PendingFile>;
}

export const PendingFilesContext = createContext<PendingFilesContextType | undefined>(undefined);

export const PendingFilesProvider = ({ children }: { children: React.ReactNode }) => {
	const [downloadPendingFiles, setDownloadPendingFiles] = useState<PendingFile[]>([]);
	const [currentFileDownloadingId, setCurrentFileDownloadingId] = useState<string>('');

	useEffect(() => {
		downloadPendingFiles.forEach(f => {
			if (f.percentage === 100) {
				setTimeout(() => {
					toast.success('File downloaded successfully' + f.fileId);

					setDownloadPendingFiles(prevFiles =>
						prevFiles.filter(f => f.fileId !== f.fileId)
					);
					setCurrentFileDownloadingId('');
				}, 2000);
			}
		});
	}, [downloadPendingFiles]);

	const handleNewPendingFile = (file: PendingFile) => {
		setDownloadPendingFiles(prevFiles => {
			const existingFile = prevFiles.find(
				f => f.fileId === file.fileId && f.driveId === file.driveId
			);
			if (existingFile) {
				return prevFiles.map(f =>
					f.fileId === file.fileId && f.driveId === file.driveId ? file : f
				);
			}
			setCurrentFileDownloadingId(file.fileId);
			return [...prevFiles, file];
		});
	};

	return (
		<PendingFilesContext.Provider
			value={{
				downloadPendingFiles,
				handleNewPendingFile,
				areFilesPending: downloadPendingFiles.some(f => f.percentage > 0),
				currentFileDownloading:
					downloadPendingFiles.find(f => f.fileId === currentFileDownloadingId) ?? null,
			}}
		>
			{children}
		</PendingFilesContext.Provider>
	);
};
