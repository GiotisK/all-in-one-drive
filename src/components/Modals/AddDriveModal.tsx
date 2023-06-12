import { BaseModal, BaseModalProps } from "./BaseModal";
import { AddDriveButton } from "../AddDriveButton";
import { DriveType } from "../../Shared/types/types";
import { styled } from "styled-components";

const ButtonsContainer = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: space-evenly;
	align-items: center;
	height: 200px;
	width: 500px;
`;

export const AddDriveModal = (props: BaseModalProps): JSX.Element => {
	return (
		<BaseModal
			title="Add a drive"
			visible={props.visible}
			closeModal={props.closeModal}
			showFooter={false}
		>
			<ButtonsContainer>
				<AddDriveButton type={DriveType.GoogleDrive} />
				<AddDriveButton type={DriveType.Dropbox} />
				<AddDriveButton type={DriveType.OneDrive} />
			</ButtonsContainer>
		</BaseModal>
	);
};
