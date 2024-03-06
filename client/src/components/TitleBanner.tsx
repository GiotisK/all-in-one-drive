import styled from 'styled-components';
import { Loader } from './Loader';
import { UserMenu } from './UserMenu';
import { SvgNames, createSvg } from '../shared/utils/svg-utils';
import { ThemeToggle } from './Toggle/ThemeToggle';
import { Nullable } from '../shared/types/global.types';
import { useAppSelector } from '../redux/store/store';
import { useNavigate } from 'react-router-dom';
import { routes } from '../shared/constants/routes';
import { useIsInsideFolder } from '../hooks/useIsInsideFolder';

const BannerContainer = styled.div`
	display: flex;
	position: sticky;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	top: 0;
	width: 100%;
	height: 50px;
	background-color: ${({ theme }) => theme.colors.bluePrimary};
	box-shadow: ${({ theme }) => theme.colors.boxShadow};
	z-index: 2;
`;

const LogoMenuContainer = styled.div`
	display: flex;
	flex-direction: row;
	align-items: flex-end;
	margin-left: 8px;
`;

const LogoTitle = styled.p`
	font-family: 'Arciform';
	font-size: 50px;
	color: white;
	padding-left: 10px;
	padding-top: 5px;
	margin: 0;
	margin-bottom: 3px;
	font-size: 32px;
	user-select: none;
	cursor: pointer;
`;

const BurgerMenuButton = styled.div`
	cursor: pointer;
	transition: all 0.2s ease;
	margin-bottom: 5px;
	&:hover {
		-webkit-transform: scale(1.05);
		-ms-transform: scale(1.05);
		transform: scale(1.05);
	}
`;

const QuotaLoaderContainer = styled.div`
	margin-left: auto;
	margin-right: 150px;
	display: flex;
	flex-direction: row;
	align-items: center;
`;

const QuotaStringLoader = styled.p`
	margin: 0;
	margin-right: 5px;
	color: white;
	font-size: 14px;
`;

const QuotaGigabytes = styled.span`
	font-weight: bold;
	font-size: 13px;
	color: white;
`;

const ThemeToggleWrapper = styled.div`
	margin-right: 20px;
`;

const ToggleAndMenuContainer = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
`;

interface TitleBannerProps {
	virtualDriveEnabled?: boolean;
	popupMenu?: boolean;
	virtualQuota?: Nullable<string>;
	email?: string;
	onBurgerMenuClick?: () => void;
	onAddDriveClick?: () => void;
	onSignOutClick?: () => void;
	onSwitchDriveModeClick?: () => void;
}

export const TitleBanner = (props: TitleBannerProps): JSX.Element => {
	const navigate = useNavigate();
	const isAuthenticated = useAppSelector(state => state.user.isAuthenticated);
	const isInsideFolder = useIsInsideFolder();

	const virtualQuotaLoading = false;
	const virtualQuotaStr = '5 / 5 GB';
	const virtualDriveEnabled = false;

	const navigateToDrivePath = () => {
		navigate(routes.drive);
	};

	return (
		<BannerContainer>
			<LogoMenuContainer>
				{!isInsideFolder && (
					<BurgerMenuButton onClick={props.onBurgerMenuClick}>
						{createSvg(SvgNames.Burger, 30, 'white')}
					</BurgerMenuButton>
				)}
				<LogoTitle onClick={navigateToDrivePath}>aio drive</LogoTitle>
			</LogoMenuContainer>
			{virtualDriveEnabled && (
				<QuotaLoaderContainer>
					<QuotaStringLoader>Virtual Quota:</QuotaStringLoader>
					{virtualQuotaLoading ? (
						<Loader size={10} />
					) : (
						<QuotaGigabytes>{virtualQuotaStr}</QuotaGigabytes>
					)}
				</QuotaLoaderContainer>
			)}
			<ToggleAndMenuContainer>
				<ThemeToggleWrapper>
					<ThemeToggle />
				</ThemeToggleWrapper>
				{isAuthenticated && <UserMenu />}
			</ToggleAndMenuContainer>
		</BannerContainer>
	);
};
