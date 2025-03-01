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

	useEffect(
		function updatePendingFiles() {
			downloadPendingFiles.forEach(f => {
				if (f.percentage === 100) {
					setTimeout(() => {
						// prevent duplicate toast pops
						if (!toast.isActive(f.downloadId)) {
							toast.success('Downloaded success: ' + f.name, {
								toastId: f.downloadId,
							});
						}

						setDownloadPendingFiles(prevFiles =>
							prevFiles.filter(prevF => prevF.downloadId !== f.downloadId)
						);
						setCurrentFileDownloadingId('');
					}, 2000);
				}
			});
		},
		[downloadPendingFiles]
	);

	const handleNewPendingFile = (newPendingfile: PendingFile) => {
		//append new file or update existing progress
		setDownloadPendingFiles(prevFiles => {
			const existingFile = prevFiles.find(
				f =>
					f.downloadId === newPendingfile.downloadId &&
					f.driveId === newPendingfile.driveId
			);
			if (existingFile) {
				return prevFiles.map(f =>
					f.downloadId === newPendingfile.downloadId &&
					f.driveId === newPendingfile.driveId
						? newPendingfile
						: f
				);
			}
			setCurrentFileDownloadingId(newPendingfile.downloadId);
			return [...prevFiles, newPendingfile];
		});
	};

	return (
		<PendingFilesContext.Provider
			value={{
				downloadPendingFiles,
				handleNewPendingFile,
				areFilesPending: downloadPendingFiles.some(f => f.percentage > 0),
				currentFileDownloading:
					downloadPendingFiles.find(f => f.downloadId === currentFileDownloadingId) ??
					null,
			}}
		>
			{children}
		</PendingFilesContext.Provider>
	);
};
