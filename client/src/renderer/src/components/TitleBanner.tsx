import styled, { useTheme } from 'styled-components';
import { Loader } from './Loader';
import { UserMenu } from './UserMenu';
import { SvgNames, createSvg } from '../shared/utils/svg-utils';
import { ThemeToggle } from './Toggle/ThemeToggle';
import { Nullable } from '../shared/types/global.types';
import { useAppSelector } from '../redux/store/store';
import { useNavigate } from 'react-router-dom';
import { routes } from '../shared/constants/routes';
import { useIsInsideFolder } from '../hooks/useIsInsideFolder';
import { IconButton } from './IconButton';
import { useConnectDriveMutation, useGetVirtualQuotaQuery } from '../redux/rtk/driveApi';

const BannerContainer = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	width: 100%;
	height: 35px;
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
	color: white;
	padding-left: 10px;
	padding-top: 5px;
	margin: 0;
	margin-bottom: 5px;
	font-size: 24px;
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
	const isVirtualDriveEnabled = useAppSelector(state => state.settings.isVirtualDriveEnabled);
	const isAuthenticated = useAppSelector(state => state.user.isAuthenticated);
	const navigate = useNavigate();
	const isInsideFolder = useIsInsideFolder();
	const [_connectDrive, { isLoading: isConnectDriveLoading }] = useConnectDriveMutation({
		fixedCacheKey: 'connectDrive',
	});
	const { isLoading: virtualQuotaLoading, data: virtualQuota } = useGetVirtualQuotaQuery(
		undefined,
		{ skip: isConnectDriveLoading }
	);

	const navigateToDrivePath = () => {
		navigate(routes.drive);
	};

	return (
		<BannerContainer>
			<LogoMenuContainer>
				{isInsideFolder ? (
					<BackButton />
				) : (
					<BurgerMenuButton onClick={props.onBurgerMenuClick}>
						{createSvg(SvgNames.Burger, 24, 'white')}
					</BurgerMenuButton>
				)}
				<LogoTitle onClick={navigateToDrivePath}>aio drive</LogoTitle>
			</LogoMenuContainer>
			{isVirtualDriveEnabled && (
				<QuotaLoaderContainer>
					<QuotaStringLoader>Virtual Quota:</QuotaStringLoader>
					{virtualQuotaLoading ? (
						<Loader size={10} />
					) : (
						<QuotaGigabytes>{`${virtualQuota?.used} / ${virtualQuota?.total}GB`}</QuotaGigabytes>
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

const BackButtonContainer = styled.div`
	user-select: none;
	cursor: pointer;
	align-self: center;
`;

const BackButton = () => {
	const navigate = useNavigate();
	const theme = useTheme();

	const goBack = () => {
		navigate(-1);
	};

	return (
		<BackButtonContainer>
			<IconButton
				icon={SvgNames.Back}
				size={20}
				onClick={goBack}
				color={theme?.colors.textPrimary}
			/>
		</BackButtonContainer>
	);
};
