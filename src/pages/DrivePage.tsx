import { useState } from "react";
import { AddDriveModal } from "../components/Modals/AddDriveModal";
import { DeleteModal } from "../components/Modals/DeleteModal";
import { DriveType } from "../Shared/types/types";
import { RenameModal } from "../components/Modals/RenameModal";
import { ExportFormatModal } from "../components/Modals/ExportFormatModal";

export const DrivePage = (): JSX.Element => {
	const [deleteModalVisible, setDeleteModalVisible] = useState(false);
	const [addDriveModalVisible, setAddDriveModalVisible] = useState(false);
	const [renameModalVisible, setRenameModalVisible] = useState(false);
	const [exportFormatModalVisible, setExportFormatModalVisible] =
		useState(false);
	return (
		<>
			<ExportFormatModal
				visible={exportFormatModalVisible}
				closeModal={() => {
					setExportFormatModalVisible(false);
				}}
				exportFormats={["pdf", "docx", "txt", "json"]}
			/>
			<RenameModal
				visible={renameModalVisible}
				closeModal={() => {
					setRenameModalVisible(false);
				}}
			/>
			<AddDriveModal
				visible={addDriveModalVisible}
				closeModal={() => {
					setAddDriveModalVisible(false);
				}}
			/>
			<DeleteModal
				visible={deleteModalVisible}
				closeModal={() => {
					setDeleteModalVisible(false);
				}}
				/* entity={{
					id: "123",
					permissions: "",
					type: FileType.File,
					drive: DriveType.GoogleDrive,
					name: "palaris",
					size: 12314,
					fileEmail: "palaris@loris.com",
					ownerEmail: "poloris@laris.com",
					date: "12/3/12",
					extension: "json",
					isShared: true,
				}} */
				entity={{
					type: DriveType.Dropbox,
					email: "palaris@kkek.com",
				}}
			/>
			<button
				onClick={() => {
					setDeleteModalVisible(true);
				}}
			>
				click
			</button>
			<button
				onClick={() => {
					setAddDriveModalVisible(true);
				}}
			>
				click2
			</button>

			<button
				onClick={() => {
					setRenameModalVisible(true);
				}}
			>
				click3
			</button>
			<button
				onClick={() => {
					setExportFormatModalVisible(true);
				}}
			>
				click4
			</button>
		</>
	);
};
