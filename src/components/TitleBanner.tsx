import styled, { css } from "styled-components";
import { Loader } from "./Loader";
import { ReactComponent as Burger } from "../assets/svgs/burger.svg";

const BannerContainer = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: baseline;
	top: 0;
	width: 100%;
	height: 50px;
	border-radius: 0 0 7px 7px;
	background-color: #24a0ed;
	box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
`;

const LogoMenuContainer = styled.div`
	display: flex;
	flex-direction: row;
	align-items: flex-end;
	margin-left: 8px;
`;

const LogoTitle = styled.p`
	font-family: "Arciform";
	font-size: 50px;
	color: white;
	padding-left: 10px;
	padding-top: 5px;
	margin: 0;
	margin-bottom: 3px;
	font-size: 32px;
	user-select: none;
`;
interface BurgerMenuButtonProps {
	hover: boolean;
}
const BurgerMenuButton = styled.div<BurgerMenuButtonProps>`
	transition: all 0.2s ease;
	margin-bottom: 5px;
	&:hover {
		-webkit-transform: scale(1.05);
		-ms-transform: scale(1.05);
		transform: scale(1.05);
	}
`;

const QuotaLoaderContainer = styled.div`
	margin-right: 150px;
	display: flex;
	flex-direction: row;
`;

const QuotaStringLoader = styled.p`
	margin: 0;
	margin-right: 5px;
	color: white;
	font-size: 14px;
`;

const QuotaString = styled.p`
	margin-right: 95px;
	color: white;
	font-size: 14px;
`;

const QuotaGigabytes = styled.span`
	font-weight: bold;
	font-size: 13px;
`;

interface TitleBannerProps {
	virtualDriveEnabled?: boolean;
	popupMenu?: boolean;
	virtualQuota?: string | null;
	email?: string;
	onBurgerMenuClick?: () => void;
	onAddDriveClick?: () => void;
	onSignOutClick?: () => void;
	onSwitchDriveModeClick?: () => void;
}

export const TitleBanner = (props: TitleBannerProps): JSX.Element => {
	const handleBurgerMenuClick = () => {
		props.onBurgerMenuClick?.();
	};

	const handleAddDriveClick = () => {
		props.onAddDriveClick?.();
	};

	const handleSignOutClick = () => {
		props.onSignOutClick?.();
	};

	const handleSwitchDriveModeClick = () => {
		props.onSwitchDriveModeClick?.();
	};

	return (
		<BannerContainer>
			<LogoMenuContainer>
				{props.virtualDriveEnabled || !props.popupMenu ? null : (
					<BurgerMenuButton
						hover={true}
						onClick={handleBurgerMenuClick}
					>
						<Burger width={30} height={30} />
					</BurgerMenuButton>
				)}

				<LogoTitle>aio drive</LogoTitle>
			</LogoMenuContainer>

			{props.virtualDriveEnabled &&
				props.popupMenu &&
				(props.virtualQuota === null ? (
					<QuotaLoaderContainer>
						<QuotaStringLoader>Virtual Quota:</QuotaStringLoader>
						<Loader loadingText={false} size={"10px"} />
					</QuotaLoaderContainer>
				) : (
					<QuotaString>
						Virtual Quota:{" "}
						<QuotaGigabytes>{props.virtualQuota}</QuotaGigabytes>
					</QuotaString>
				))}

			{/* {props.popupMenu === false ? null : (
				<UserMenu
					email={props.email}
					virtualDriveEnabled={props.virtualDriveEnabled}
					onAddDriveClick={handleAddDriveClick}
					onSignOutClick={handleSignOutClick}
					onSwitchDriveModeClick={handleSwitchDriveModeClick}
				/>
			)} */}
		</BannerContainer>
	);
};
