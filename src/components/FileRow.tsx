import { useState } from "react";
import { FileElement } from "./FileElement";
import { SvgNames } from "../Shared/utils/svg-utils.js";
import { CreateDriveSvg, formatBytes } from "../Shared/utils/utils.js";
import { Drive, FileType } from "../Shared/types/types.js";
import { IconButton } from "./IconButton.js";
import { styled } from "styled-components";

const Container = styled.div`
	display: flex;
	flex-direction: row;
	margin-left: 10px;
	padding: 10px 0 10px 10px;
	border-bottom: solid 0.5px #f0f0f0;
	border-radius: 4px;
`;

const ColumnBase = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
	align-items: center;
`;

const FirstColumn = styled(ColumnBase)`
	cursor: pointer;
	width: 40%;
`;

const SecondColumn = styled(ColumnBase)`
	width: 20%;
`;

const ThirdColumn = styled(ColumnBase)`
	width: 10%;
`;

const FourthColumn = styled(ColumnBase)`
	width: 20%;
`;

const Text = styled.p`
	margin: 0;
	margin-left: 2%;
	width: 90%;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	font-size: 16px;
	margin-right: 5%;
`;

const PopupMenu = styled.div`
	position: absolute;
	z-index: 1;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	width: 100px;
	top: 30px;
	right: 0px;
	border: solid 1px #f0f0f0;
	border-radius: 5px;
	background-color: white;
	box-shadow: 0 3px 6px rgba(0, 0, 0, 0.25), 0 3px 6px rgba(0, 0, 0, 0.25);
`;

const MenuRow = styled.div`
	border-bottom: solid 1px #f0f0f0;
`;

const MenuRowText = styled.p`
	flex-grow: 1;
	margin: 0;
	padding: 3% 3% 3% 5%;
	border-radius: 4px;

	&:hover {
		background-color: #a8cef591;
		cursor: pointer;
	}
`;

interface IProps {
	permissions: string;
	type: FileType;
	drive: Drive;
	name: string;
	size: number;
	fileEmail: string;
	ownerEmail: string;
	date: string;
	onFileClick: () => void;
	extension: string;
	onCopyShareLinkClick: () => void;
	isShared: boolean;
}

type FileMenuRow = {
	text: string;
	onClick: () => void;
};

export const FileRow = (props: IProps): JSX.Element => {
	const [menuToggle, setMenuToggle] = useState(false);
	const fileMenuRows: FileMenuRow[] = [
		{
			text: "Download",
			onClick: () => {
				console.log("download");
			},
		},
		{
			text: "Rename",
			onClick: () => {
				console.log("rename");
			},
		},
		{
			...(props.isShared ? { text: "Unshare" } : { text: "Share" }),
			onClick: () => {
				console.log("share");
			},
		},
		{
			text: "Delete",
			onClick: () => {
				console.log("delete");
			},
		},
	];

	function toggleMenu() {
		setMenuToggle((prevToggle) => !prevToggle);
	}

	const filemenu = (
		<IconButton
			icon={SvgNames.Dots}
			size={22}
			color="gray"
			styles="position: relative"
			onClick={toggleMenu}
		>
			{menuToggle && (
				<PopupMenu>
					{fileMenuRows.map((row, index) => (
						<MenuRow key={index} onClick={row.onClick}>
							<MenuRowText>{row.text}</MenuRowText>
						</MenuRow>
					))}
				</PopupMenu>
			)}
		</IconButton>
	);

	return (
		<Container>
			<FirstColumn onClick={props.onFileClick}>
				<FileElement type={props.type} extension={props.extension} />
				<Text>{props.name}</Text>
			</FirstColumn>
			<SecondColumn>
				{CreateDriveSvg(props.drive)}
				<Text>{props.fileEmail}</Text>
			</SecondColumn>
			<ThirdColumn>
				<Text>{formatBytes(props.size)}</Text>
			</ThirdColumn>
			<FourthColumn>
				<Text>{props.date}</Text>
				{filemenu}

				{props.isShared && (
					<IconButton
						icon={SvgNames.Link}
						color="#82d882"
						size={20}
						onClick={() => {
							console.log("share");
						}}
					/>
				)}
			</FourthColumn>
		</Container>
	);
};
