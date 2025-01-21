import { createContext, useState } from 'react';

export interface DriveSelectionContextType {
	selectedDriveIds: string[];
	setSelectedDriveIds: React.Dispatch<React.SetStateAction<string[]>>;
}

export const DriveSelectionContext = createContext<DriveSelectionContextType | undefined>(
	undefined
);

export const DriveSelectionProvider = ({ children }: { children: React.ReactNode }) => {
	const [selectedDriveIds, setSelectedDriveIds] = useState<string[]>([]);

	return (
		<DriveSelectionContext.Provider value={{ selectedDriveIds, setSelectedDriveIds }}>
			{children}
		</DriveSelectionContext.Provider>
	);
};
