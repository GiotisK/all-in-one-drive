import { useState } from 'react';
import { MenuBanner } from '../components/MenuBanner';
import { DropZone } from '../components/DropZone';
import { SideMenu } from '../components/SideMenu';
import { TitleBanner } from '../components/TitleBanner';
import { FloatingButtonsContainer } from '../components/FloatingButtons/FloatingButtonsContainer';
import { LoadingBar } from '../components/LoadingBar';
import { styled } from 'styled-components';

import { ModalContainer } from '../components/Modals/ModalContainer';
import {
	useCheckAuth,
	useHandleAuthCodeFromUrl,
	useServerSideEvents,
	useSubscribeForDriveChanges,
} from '../hooks';
import { useFetchInitialData } from '../hooks/useFetchInitialData';
import { Navigate } from 'react-router-dom';
import { routes } from '../shared/constants/routes';
import { useAppSelector } from '../redux/store/store';
import { FilesList } from '../components/FilesList';
import { useFetchFolderContents } from '../hooks/useFetchFolderContents';

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
	const [sideMenuVisible, setSideMenuVisible] = useState(true);
	const isUserAuthenticated = useAppSelector(state => state.user.isAuthenticated);

	useCheckAuth();
	useHandleAuthCodeFromUrl();
	useFetchInitialData();
	useFetchFolderContents();

	useServerSideEvents();
	useSubscribeForDriveChanges();

	return isUserAuthenticated ? (
		<OuterContainer>
			<InnerContainer>
				{sideMenuVisible && <SideMenu />}
				<RowsScrollview>
					<TitleBanner
						onBurgerMenuClick={() => {
							setSideMenuVisible(prevVisible => !prevVisible);
						}}
					/>
					<DropZone>
						<MenuBanner />
						<LoadingBar />
						<FilesList />
					</DropZone>
					<FloatingButtonsContainer />
				</RowsScrollview>
			</InnerContainer>
			<ModalContainer />
		</OuterContainer>
	) : (
		<Navigate to={routes.login} />
	);
};
