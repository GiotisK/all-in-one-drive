import { DriveRow } from "../components/DriveRow";

export const DrivePage = (): JSX.Element => {
	return (
		<>
			<DriveRow
				drive="dropbox"
				email="kostas.yiotis@ghotmail.com"
				onClick={() => {
					return;
				}}
				onDeleteDriveClick={() => {
					return;
				}}
				quota="15 / 20"
				enabled={false}
			/>
			<DriveRow
				drive="googledrive"
				email="kostas.yiotis@ghotmail.com"
				onClick={() => {
					return;
				}}
				onDeleteDriveClick={() => {
					return;
				}}
				quota="15 / 20"
				enabled={false}
			/>
			<DriveRow
				drive="onedrive"
				email="kostas.yiotis@ghotmail.com"
				onClick={() => {
					return;
				}}
				onDeleteDriveClick={() => {
					return;
				}}
				quota="15 / 20"
				enabled={true}
			/>
		</>
	);
};
