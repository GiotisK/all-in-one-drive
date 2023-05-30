import { Drive, FileType } from "../Shared/types/types";
import { FileElement } from "../components/FileElement";
import { FileRow } from "../components/FileRow";

export const DrivePage = (): JSX.Element => {
	return (
		<>
			<FileRow
				date="12/12/12"
				drive={Drive.GoogleDrive}
				fileEmail="KOSTAS.Yioyis@gotmail.com"
				extension=".jpg"
				name="palaris"
				permissions="moloris"
				size={123124}
				type={FileType.File}
				onCopyShareLinkClick={() => console.log("copy share link")}
				onDeleteClick={() => console.log("delete")}
				onDownloadClick={() => console.log("download")}
				onFileClick={() => console.log("file click")}
				onRenameClick={() => console.log("rename")}
				onShareClick={(isShared: boolean) => console.log("share")}
				ownerEmail="palaris@moloris.kek"
				isShared={true}
			/>
		</>
	);
};
