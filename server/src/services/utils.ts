export const getDefaultSavePathForFile = (fileName: string, fileExtension: string) => {
	return process.env.USERPROFILE + '/Downloads/' + fileName + '.' + fileExtension;
};
