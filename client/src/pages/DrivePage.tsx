import { useState } from 'react';
import { MenuBanner } from '../components/MenuBanner';
import { DropZone } from '../components/DropZone';
import { SideMenu } from '../components/SideMenu';
import { TitleBanner } from '../components/TitleBanner';
import { FloatingButtonsContainer } from '../components/FloatingButtons/FloatingButtonsContainer';
import { LoadingBar } from '../components/LoadingBar';
import { styled } from 'styled-components';

import { ModalContainer } from '../components/Modals/ModalContainer';
import { useCheckAuth, useHandleAuthCodeFromUrl } from '../hooks';
import { useFetchInitialData } from '../hooks/useFetchInitialData';
import { Navigate } from 'react-router-dom';
import { routes } from '../shared/constants/routes';
import { useAppSelector } from '../redux/store/store';
import { FilesList } from '../components/FilesList';
import { useFetchFolderContents } from '../hooks/useFetchFolderContents';

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

	return isUserAuthenticated ? (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				height: '100%',
			}}
		>
			{/*TODO: convert containers to styled components */}
			<div
				style={{
					display: 'flex',
					flexDirection: 'row',
					height: '100%',
				}}
			>
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
			</div>
			<ModalContainer />
		</div>
	) : (
		<Navigate to={routes.login} />
	);
};
