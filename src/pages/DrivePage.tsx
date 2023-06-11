import { useState } from "react";
import { AddDriveModal } from "../components/Modals/AddDriveModal";
import { DeleteModal } from "../components/Modals/DeleteModal";
import { DriveType, FileType } from "../Shared/types/types";
import { RenameModal } from "../components/Modals/RenameModal";
import { ExportFormatModal } from "../components/Modals/ExportFormatModal";
import { MenuBanner } from "../components/MenuBanner";
import { DropZone } from "../components/DropZone";
import { FileRow } from "../components/FileRow";
import { SideMenu } from "../components/SideMenu";
import { TitleBanner } from "../components/TitleBanner";
import { UploadModal } from "../components/Modals/UploadModal";

export const DrivePage = (): JSX.Element => {
	/* const [deleteModalVisible, setDeleteModalVisible] = useState(false);
	const [addDriveModalVisible, setAddDriveModalVisible] = useState(false);
	const [renameModalVisible, setRenameModalVisible] = useState(false);
	const [exportFormatModalVisible, setExportFormatModalVisible] =
		useState(false); */

	const [uploadModalVisible, setUploadModalVisible] = useState(true);
	const [sideMenuVisible, setSideMenuVisible] = useState(false);
	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				height: "100%",
				marginTop: "50px",
			}}
		>
			<div
				style={{
					display: "flex",
					flexDirection: "row",
					height: "100%",
				}}
			>
				{sideMenuVisible && (
					<SideMenu
						onCloseSideMenuClick={() => {
							setSideMenuVisible(false);
						}}
					/>
				)}
				<div style={{ flex: 1, overflow: "auto" }}>
					<DropZone>
						<MenuBanner
							onBackButtonClick={() => {
								console.log("back pressed");
							}}
						/>
						{[
							1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 16,
						].map((i) => (
							<FileRow
								file={{
									id: "1",
									date: "212312",
									drive: DriveType.Dropbox,
									extension: ".jsx",
									fileEmail: "palaris@moris.com",
									isShared: false,
									name: "palaris",
									ownerEmail: "moloris@molia.com",
									permissions: "",
									size: 123,
									type: FileType.File,
								}}
								onFileClick={function (): void {
									throw new Error(
										"Function not implemented."
									);
								}}
								onCopyShareLinkClick={function (): void {
									throw new Error(
										"Function not implemented."
									);
								}}
							/>
						))}
					</DropZone>
				</div>
			</div>
			<UploadModal
				closeModal={() => {
					setUploadModalVisible(false);
				}}
				fileType={FileType.Folder}
				visible={uploadModalVisible}
			/>
			<TitleBanner
				onBurgerMenuClick={() => {
					setSideMenuVisible((prevVisible) => !prevVisible);
				}}
			/>
			{/* <ExportFormatModal
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
				entity={{
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
				}}
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
			</button> */}
		</div>
	);
};
