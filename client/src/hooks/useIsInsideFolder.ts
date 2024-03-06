import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export const useIsInsideFolder = () => {
	const pathParams = useParams();
	const [isInsideFolder, setIsInsideFolder] = useState<boolean>(false);

	useEffect(() => {
		const { driveId, folderId } = pathParams;
		setIsInsideFolder(!!driveId && !!folderId);
	}, [pathParams]);

	return isInsideFolder;
};
