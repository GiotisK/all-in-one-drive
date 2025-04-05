import { useRef, useState } from 'react';
import { MenuBanner } from '../components/MenuBanner';
import { DropZone } from '../components/DropZone';
import { SideMenu } from '../components/SideMenu';
import { TitleBanner } from '../components/TitleBanner';
import { FloatingButtonsContainer } from '../components/FloatingButtons/FloatingButtonsContainer';
import { LoadingBar } from '../components/LoadingBar';
import { styled } from 'styled-components';
import { ModalContainer } from '../components/Modals/ModalContainer';
import { Navigate } from 'react-router-dom';
import { routes } from '../shared/constants/routes';
import { useAppSelector } from '../redux/store/store';
import { FilesList } from '../components/FilesList';
import { useIsInsideFolder } from '../hooks/useIsInsideFolder';
import { DriveSelectionProvider } from '../providers/DriveSelection';
import { useRestoreScrollPosition } from '../hooks/useRestoreScrollPosition';
import { useHandleAuthCodeFromUrl } from '../hooks/useHandleAuthCodeFromUrl';
import { useServerSideEvents } from '../hooks/useServerSideEvents';

const OuterContainer = styled.div`
	display: flex;
	flex-direction: column;
	height: 100%;
`;

const InnerContainer = styled.div`
	display: flex;
	flex-direction: row;
	height: 100%;
`;

const RowsScrollview = styled.div`
	flex: 1;
	overflow: auto;
	background-color: ${({ theme }) => theme.colors.background};
`;

export const DrivePage = (): JSX.Element => {
	const isSideMenuVisible =
		localStorage.getItem('sideMenuVisible') === null
			? true
			: localStorage.getItem('sideMenuVisible') === 'true';
	const scrollViewRef = useRef<HTMLDivElement>(null);
	const [sideMenuVisible, setSideMenuVisible] = useState(isSideMenuVisible);
	const isUserAuthenticated = useAppSelector(state => state.user.isAuthenticated);
	const isInsideFolder = useIsInsideFolder();

	useHandleAuthCodeFromUrl();
	useServerSideEvents();
	useRestoreScrollPosition(scrollViewRef);

	return isUserAuthenticated ? (
		<OuterContainer>
			<InnerContainer>
				<DriveSelectionProvider>
					{sideMenuVisible && !isInsideFolder && <SideMenu />}

					<DropZone>
						<RowsScrollview ref={scrollViewRef}>
							<TitleBanner
								onBurgerMenuClick={() => {
									localStorage.setItem(
										'sideMenuVisible',
										String(!sideMenuVisible)
									);
									setSideMenuVisible(prev => !prev);
								}}
							/>
							<MenuBanner />
							<LoadingBar />
							<FilesList />
							<FloatingButtonsContainer />
						</RowsScrollview>
					</DropZone>
				</DriveSelectionProvider>
			</InnerContainer>
			<ModalContainer />
		</OuterContainer>
	) : (
		<Navigate to={routes.login} />
	);
};
