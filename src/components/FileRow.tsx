import { useState } from "react";
import { FileElement } from "./FileElement";
import { SvgNames } from "../Shared/utils/svg-utils";
import { CreateDriveSvg, formatBytes } from "../Shared/utils/utils";
import { IconButton } from "./IconButton";
import { styled, useTheme } from "styled-components";
import { FileEntity } from "../Shared/types/types";

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
	file: FileEntity;
	onFileClick: () => void;
	onCopyShareLinkClick: () => void;
}

type FileMenuRow = {
	text: string;
	onClick: () => void;
};

export const FileRow = ({
	file,
	onFileClick,
	onCopyShareLinkClick,
}: IProps): JSX.Element => {
	const theme = useTheme();
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
			...(file.isShared ? { text: "Unshare" } : { text: "Share" }),
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
			<FirstColumn onClick={onFileClick}>
				<FileElement type={file.type} extension={file.extension} />
				<Text>{file.name}</Text>
			</FirstColumn>
			<SecondColumn>
				{CreateDriveSvg(file.drive)}
				<Text>{file.fileEmail}</Text>
			</SecondColumn>
			<ThirdColumn>
				<Text>{formatBytes(file.size)}</Text>
			</ThirdColumn>
			<FourthColumn>
				<Text>{file.date}</Text>
				{filemenu}

				{file.isShared && (
					<IconButton
						icon={SvgNames.Link}
						color={theme?.colors.green}
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