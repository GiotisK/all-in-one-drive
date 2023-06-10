import { useState } from "react";
import styled from "styled-components";

const PopupMenuContainer = styled.div`
	position: absolute;
	display: flex;
	flex-direction: column;
	align-items: flex-end;
	right: 1%;
	z-index: 2;
`;

const CircleButtonContainer = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	height: 60px;
	width: 60px;
	border-radius: 35px;
	margin-right: 10px;
	box-shadow: 0 3px 6px rgba(0, 0, 0, 0.25), 0 3px 6px rgba(0, 0, 0, 0.25);
	background-color: #c9c9c9;
	cursor: pointer;
	border-width: 1.5px;
	border-color: #99c6f3;
	transition: all 0.2s ease;

	&:hover {
		transform: scale(1.1);
		border-radius: 35px;
	}
`;

const CircleButtonLetter = styled.p`
	user-select: none;
	font-size: 30px;
	color: white;
`;

const PopupMenu = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	height: max-content;
	width: 250px;
	margin-top: 4%;
	margin-right: 5%;
	border: solid 1px #f0f0f0;
	border-radius: 5px;
	background-color: white;
	box-shadow: 0 3px 6px rgba(0, 0, 0, 0.25), 0 3px 6px rgba(0, 0, 0, 0.25);
`;

const UsernameContainer = styled.div`
	flex: 1;
	border-bottom: solid 1px #f0f0f0;
	word-wrap: break-word;
	padding-right: 4px;
`;

const SettingsContainer = styled.div`
	flex: 1;
	display: flex;
	align-items: center;
	border-bottom: solid 1px #f0f0f0;
	padding: 5px;
`;

const UserText = styled.p`
	margin: 3% 0 0 3%;
	color: black;
	border-bottom: solid 1px #f0f0f0;
	font-size: 20px;
`;

const UsernameText = styled.p`
	margin: 2% 0 0 6%;
	font-size: 15px;
	color: gray;
`;

const SettingsText = styled.p`
	flex-grow: 1;
	margin: 0 3% 0 3%;
	padding: 1% 0% 1% 3%;
	border-radius: 4px;
	color: black;
	font-size: 17px;
	user-select: none;

	&:hover {
		background-color: #a8cef591;
		cursor: pointer;
	}
`;

export const UserMenu = (): JSX.Element => {
	const [menuVisible, setMenuVisible] = useState(false);

	const virtualDriveEnabled = true;
	const email = "kostas@giotis.com";

	const getCapitalLetterFromUsername = () => {
		return email.charAt(0).toUpperCase();
	};

	const renderMenuOptions = () => {
		const optionsMap = [
			{
				title: "Add a drive",
				onClick: () => {
					return;
				},
			},
			{
				title: "Switch to all-in-one drive",
				onClick: () => {
					return;
				},
			},
			{
				title: "Switch to virtual drive",
				onClick: () => {
					return;
				},
			},
			{
				title: "Signout",
				onClick: () => {
					return;
				},
			},
		];

		const indexToRemove = virtualDriveEnabled ? 2 : 1;
		optionsMap.splice(indexToRemove, 1);

		return optionsMap.map((option, index) => (
			<SettingsContainer key={index} onClick={option.onClick}>
				<SettingsText>{option.title}</SettingsText>
			</SettingsContainer>
		));
	};

	return (
		<PopupMenuContainer>
			<CircleButtonContainer
				onClick={() => {
					setMenuVisible(!menuVisible);
				}}
			>
				<CircleButtonLetter>
					{getCapitalLetterFromUsername()}
				</CircleButtonLetter>
			</CircleButtonContainer>
			{menuVisible && (
				<PopupMenu>
					<UsernameContainer>
						<UserText>User</UserText>
						<UsernameText>{email}</UsernameText>
					</UsernameContainer>
					<div>{renderMenuOptions()}</div>
				</PopupMenu>
			)}
		</PopupMenuContainer>
	);
};
