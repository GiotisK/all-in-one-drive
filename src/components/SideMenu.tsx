import { styled } from "styled-components";
import { DriveType } from "../Shared/types/types";
import { SvgNames } from "../Shared/utils/svg-utils";
import { Checkbox } from "./Checkbox";
import { DriveRow } from "./DriveRow";
import { IconButton } from "./IconButton";
import { Loader } from "./Loader";

const Container = styled.div`
	background-color: #f0f0f0;
	padding: 0% 1% 0% 1%;
	width: 300px;
	background-color: #f0f0f0;
	padding: 0% 1% 0% 1%;
	width: 300px;
	display: flex;
	flex-direction: column;
`;

const Header = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
	align-items: center;
	border-bottom: 1px solid lightgray;
`;

const HeaderText = styled.div`
	font-size: 20px;
	color: gray;
	cursor: pointer;
	user-select: none;
`;

const NoDrivesText = styled.p`
	text-align: center;
	margin: 0;
	margin-top: 5%;
	color: gray;
	font-size: 20px;
`;

const NoDrivesTextClickable = styled(NoDrivesText)`
	cursor: pointer;
	font-size: 17px;
	text-decoration: underline;
`;

interface IProps {
	isInRoot?: boolean;
	checkboxChecked?: boolean;
	onDivClick?: () => void;
	onCheckboxClick?: () => void;
	onCloseSideMenuClick: () => void;
}

export const SideMenu = (props: IProps): JSX.Element => {
	const drivesLoading = false;
	const driveObjs = [1, 2, 3];
	return (
		<Container style={{}}>
			<Header>
				<HeaderText onClick={props.onDivClick}>
					Connected Drives
				</HeaderText>

				<Checkbox
					onChange={props.onCheckboxClick}
					checked={props.checkboxChecked}
					styles="margin-left: 5%;"
				/>

				<IconButton
					icon={SvgNames.Close}
					size={20}
					onClick={props.onCloseSideMenuClick}
					styles="margin-left: auto; margin-right: 5%;"
					color="gray"
				/>
			</Header>

			{drivesLoading ? (
				<Loader size={"25px"} />
			) : driveObjs.length === 0 ? (
				<>
					<NoDrivesText>
						There are no connected drives...
					</NoDrivesText>
					<NoDrivesTextClickable
						onClick={() => {
							console.log("add drive clicked");
						}}
					>
						Add a drive
					</NoDrivesTextClickable>
				</>
			) : (
				driveObjs.map((drive, index) => {
					return (
						<DriveRow
							drive={DriveType.Dropbox}
							email="palaris@molirs"
							enabled
							onClick={() => {
								console.log("cliked");
							}}
							onDeleteDriveClick={() => {
								console.log("delete clicked");
							}}
							quota="2gb/5gb"
							key={index}
						/>
					);
				})
			)}
		</Container>
	);
};
