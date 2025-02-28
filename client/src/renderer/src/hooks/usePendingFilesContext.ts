import { useContext } from 'react';
import { PendingFilesContext, PendingFilesContextType } from '../providers/PendingFilesProvider';

export const usePendingFilesContext = (): PendingFilesContextType => {
	const context = useContext(PendingFilesContext);
	if (!context) {
		throw new Error('usePendingFilesContext must be used within an provider');
	}
	return context;
};
