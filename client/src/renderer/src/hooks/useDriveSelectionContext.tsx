import { useContext } from 'react';
import { DriveSelectionContext, DriveSelectionContextType } from '../providers/DriveSelection';

export const useDriveSelectionContext = (): DriveSelectionContextType => {
	const context = useContext(DriveSelectionContext);
	if (!context) {
		throw new Error('useDriveSelectionContext must be used within an provider');
	}
	return context;
};
