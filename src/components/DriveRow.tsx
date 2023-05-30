import styled from "styled-components";
import { SvgNames, createSvg } from "../Shared/utils/svg-utils";
import { Drive } from "../Shared/types/types";
import { CreateDriveSvg } from "../Shared/utils/utils";

const DriveElementContainer = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
	height: 73px;
	background-color: white;
	margin: 2% 2% 1% 2%;
	border: solid 1px lightgray;
	border-radius: 5px;
	width: 300px;
	cursor: pointer;
	user-select: none;
	position: relative;
`;

const DriveElementEmail = styled.div`
	margin: 0;
	font-size: 14px;
	overflow-wrap: break-word;
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
	overflow: hidden;
	text-overflow: ellipsis;
`;

const DriveElementQuota = styled.p`
	align-self: flex-start;
	margin: 0;
	margin-top: 1%;
	font-size: 13px;
`;

const EmailQuotaContainer = styled.div`
	display: flex;
	width: 100%;
	flex-direction: column;
	overflow: hidden;
`;

const TrashcanDiv = styled.div`
	align-self: flex-end;
	margin-bottom: 10px;
	margin-right: 9px;
	transition: all 0.2s ease;

	&:hover {
		transform: scale(1.3);
		-webkit-transform: scale(1.3);
		-ms-transform: scale(1.3);
	}
`;

const TrashCanAndIndicatorContainer = styled.div`
	display: flex;
	height: 73px;
	flex-direction: row;
	justify-content: flex-end;
`;

const ActiveIndicator = styled.div`
	height: 73px;
	width: 5px;
	border-top-right-radius: 5px;
	border-bottom-right-radius: 5px;
	position: absolute;
`;

const DriveSvgContainer = styled.div`
	margin: 3% 2% 2% 2%;
	height: min-content;
	width: min-content;
`;

interface IProps {
	email: string;
	quota: string;
	onClick: () => void;
	onDeleteDriveClick: () => void;
	drive: Drive;
	enabled: boolean;
}

export const DriveRow = (props: IProps): JSX.Element => {
	return (
		<DriveElementContainer
			style={{ opacity: props.enabled ? 1 : 0.8 }}
			onClick={props.onClick}
		>
			<DriveSvgContainer>{CreateDriveSvg(props.drive)}</DriveSvgContainer>

			<EmailQuotaContainer>
				<DriveElementEmail>{props.email}</DriveElementEmail>
				<DriveElementQuota>{props.quota} GB</DriveElementQuota>
			</EmailQuotaContainer>

			<TrashCanAndIndicatorContainer>
				<TrashcanDiv onClick={props.onDeleteDriveClick}>
					{createSvg(SvgNames.Trashcan, 25, "gray")}
				</TrashcanDiv>
				<ActiveIndicator
					style={{
						backgroundColor: props.enabled
							? "lightgreen"
							: "lightgray",
					}}
				/>
			</TrashCanAndIndicatorContainer>
		</DriveElementContainer>
	);
};
