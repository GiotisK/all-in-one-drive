import { createContext, useEffect, useState } from 'react';
import { useGetDrivesQuery } from '../redux/rtk/driveApi';

export interface DriveSelectionContextType {
	selectedDriveIds: string[];
	setSelectedDriveIds: React.Dispatch<React.SetStateAction<string[]>>;
}

export const DriveSelectionContext = createContext<DriveSelectionContextType | undefined>(
	undefined
);

export const DriveSelectionProvider = ({ children }: { children: React.ReactNode }) => {
	const { data: drives = [], isSuccess: drivesSuccess } = useGetDrivesQuery();
	const [selectedDriveIds, setSelectedDriveIds] = useState<string[]>([]);

	useEffect(() => {
		if (drivesSuccess) {
			setSelectedDriveIds(drives.map(drive => drive.id));
		}
	}, [drives, drivesSuccess]);

	return (
		<DriveSelectionContext.Provider value={{ selectedDriveIds, setSelectedDriveIds }}>
			{children}
		</DriveSelectionContext.Provider>
	);
};
