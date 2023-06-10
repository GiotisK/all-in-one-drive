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

export const DrivePage = (): JSX.Element => {
	/* const [deleteModalVisible, setDeleteModalVisible] = useState(false);
	const [addDriveModalVisible, setAddDriveModalVisible] = useState(false);
	const [renameModalVisible, setRenameModalVisible] = useState(false);
	const [exportFormatModalVisible, setExportFormatModalVisible] =
		useState(false); */
	const [sideMenuVisible, setSideMenuVisible] = useState(false);
	return (
		<div
			style={{ display: "flex", flexDirection: "column", height: "100%" }}
		>
			<TitleBanner
				onBurgerMenuClick={() => {
					setSideMenuVisible((prevVisible) => !prevVisible);
				}}
			/>
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
				<div style={{ flex: 1 }}>
					<DropZone>
						<MenuBanner
							onBackButtonClick={() => {
								console.log("back pressed");
							}}
						/>
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
								throw new Error("Function not implemented.");
							}}
							onCopyShareLinkClick={function (): void {
								throw new Error("Function not implemented.");
							}}
						/>
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
								throw new Error("Function not implemented.");
							}}
							onCopyShareLinkClick={function (): void {
								throw new Error("Function not implemented.");
							}}
						/>
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
								throw new Error("Function not implemented.");
							}}
							onCopyShareLinkClick={function (): void {
								throw new Error("Function not implemented.");
							}}
						/>
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
								throw new Error("Function not implemented.");
							}}
							onCopyShareLinkClick={function (): void {
								throw new Error("Function not implemented.");
							}}
						/>
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
								throw new Error("Function not implemented.");
							}}
							onCopyShareLinkClick={function (): void {
								throw new Error("Function not implemented.");
							}}
						/>
					</DropZone>
				</div>
			</div>
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
