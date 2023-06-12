import { BaseModal, BaseModalProps } from "./BaseModal";
import {
	DriveEntity,
	Entity,
	FileEntity,
	FileType,
} from "../../Shared/types/types";
import { CreateDriveSvg } from "../../Shared/utils/utils";
import { DriveType } from "../../Shared/types/types";
import { styled } from "styled-components";

interface DeleteFileProps {
	file: FileEntity;
}

interface DeleteDriveProps {
	drive: DriveEntity;
}

const BoldSpan = styled.span`
	font-weight: bold;
`;

const SvgContainer = styled.span`
	display: inline-block;
	verticalalign: middle;
`;

const Content = styled.div`
	display: flex;
	flex-direction: column;
	height: 100px;
	width: 500px;
`;

const ConfirmationText = styled.div`
	flex: 1;
	margin: 0 5%;
	display: flex;
	flex-direction: column;
	justify-content: center;
`;

const DeleteFileText = ({ file }: DeleteFileProps): JSX.Element => {
	return <BoldSpan> file "{file.name}" ?</BoldSpan>;
};

const DeleteDriveText = ({ drive }: DeleteDriveProps): JSX.Element => {
	return (
		<>
			<SvgContainer>{CreateDriveSvg(drive.type, 25)}</SvgContainer>
			<BoldSpan> drive </BoldSpan> associated with
			<BoldSpan> "{drive.email}" ?</BoldSpan>
		</>
	);
};

interface IProps extends BaseModalProps {
	entity: Entity;
}

export const DeleteModal = ({
	entity,
	visible,
	closeModal,
}: IProps): JSX.Element => {
	return (
		<BaseModal
			showFooter={true}
			title="Delete"
			visible={visible}
			closeModal={closeModal}
			leftButtonText="Cancel"
			rightButtonText="Delete"
		>
			<Content>
				<ConfirmationText>
					<span>
						<span>Are you sure you want to delete the </span>
						{isFileEntity(entity) && (
							<DeleteFileText file={entity} />
						)}
						{isDriveEntity(entity) && (
							<DeleteDriveText drive={entity} />
						)}
					</span>
				</ConfirmationText>
			</Content>
		</BaseModal>
	);
};

// Helpers

const isFileEntity = (entity: Entity): entity is FileEntity => {
	return Object.values(FileType).includes(entity.type as FileType);
};

const isDriveEntity = (entity: Entity): entity is DriveEntity => {
	return Object.values(DriveType).includes(entity.type as DriveType);
};
