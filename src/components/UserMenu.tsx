import { useRef, useState } from "react";
import styled from "styled-components";
import { useOutsideClicker } from "../hooks/useOutsideClicker";

const PopupMenuContainer = styled.div`
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
	box-shadow: ${({ theme }) => theme.colors.boxShadow};
	background-color: lightgray;
	cursor: pointer;
	border-width: 1.5px;
	border-color: ${({ theme }) => theme.colors.border};
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
	border: solid 1px ${({ theme }) => theme.colors.border};
	border-radius: 5px;
	background-color: ${({ theme }) => theme.colors.background};
	box-shadow: ${({ theme }) => theme.colors.boxShadow};
`;

const UsernameContainer = styled.div`
	flex: 1;
	border-bottom: solid 1px ${({ theme }) => theme.colors.border};
	word-wrap: break-word;
	padding-right: 4px;
`;

const SettingsContainer = styled.div`
	flex: 1;
	display: flex;
	align-items: center;
	border-bottom: solid 1px ${({ theme }) => theme.colors.border};
	padding: 5px;
`;

const UserText = styled.p`
	margin: 3% 0 0 3%;
	color: ${({ theme }) => theme.colors.textPrimary};
	border-bottom: solid 1px ${({ theme }) => theme.colors.border};
	font-size: 20px;
`;

const UsernameText = styled.p`
	margin: 2% 0 0 6%;
	font-size: 15px;
	color: ${({ theme }) => theme.colors.textPrimary};
`;

const SettingsText = styled.p`
	flex-grow: 1;
	margin: 0 3% 0 3%;
	padding: 1% 0% 1% 3%;
	border-radius: 4px;
	color: ${({ theme }) => theme.colors.textPrimary};
	font-size: 17px;
	user-select: none;

	&:hover {
		background-color: ${({ theme }) => theme.colors.blueSecondary};
		cursor: pointer;
	}
`;

export const UserMenu = (): JSX.Element => {
	const [menuVisible, setMenuVisible] = useState(false);
	const menuRef = useRef(null);
	const menuTriggerRef = useRef(null);

	useOutsideClicker(menuRef, menuTriggerRef, () => setMenuVisible(false));

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
				ref={menuTriggerRef}
				onClick={() => {
					setMenuVisible(!menuVisible);
				}}
			>
				<CircleButtonLetter>
					{getCapitalLetterFromUsername()}
				</CircleButtonLetter>
			</CircleButtonContainer>
			{menuVisible && (
				<PopupMenu ref={menuRef}>
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
