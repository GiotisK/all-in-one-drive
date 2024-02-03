import { useState } from 'react';
import { MenuBanner } from '../components/MenuBanner';
import { DropZone } from '../components/DropZone';
import { FileRow } from '../components/FileRow';
import { SideMenu } from '../components/SideMenu';
import { TitleBanner } from '../components/TitleBanner';
import { FloatingButtonsContainer } from '../components/FloatingButtons/FloatingButtonsContainer';
import { LoadingBar } from '../components/LoadingBar';
import { styled } from 'styled-components';

import { ModalContainer } from '../components/Modals/ModalContainer';
import { useCheckAuth, useHandleAuthCodeFromUrl } from '../hooks';
import { Loader } from '../components/Loader';
import { useFetchInitialData } from '../hooks/useFetchInitialData';
import { Navigate } from 'react-router-dom';
import { routes } from '../shared/constants/routes';
import { useAppSelector } from '../redux/store/store';

const RowsScrollview = styled.div`
	flex: 1;
	overflow: auto;
	background-color: ${({ theme }) => theme.colors.background};
`;

const LoaderContainer = styled.div`
	margin-top: 3%;
`;

export const DrivePage = (): JSX.Element => {
	const [sideMenuVisible, setSideMenuVisible] = useState(true);
	const isUserAuthenticated = useAppSelector(state => state.user.isAuthenticated);
	const files = useAppSelector(state => state.files.files);
	const filesLoading = useAppSelector(state => state.files.requests.getFiles.loading);

	useCheckAuth();
	useHandleAuthCodeFromUrl();
	useFetchInitialData();

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
						<MenuBanner
							onBackButtonClick={() => {
								console.log('back pressed');
							}}
						/>
						<LoadingBar />
						{filesLoading ? (
							<LoaderContainer>
								<Loader size={25} />
							</LoaderContainer>
						) : (
							files.map((file, index) => (
								<FileRow
									key={index}
									file={{
										id: file.id,
										date: file.date,
										drive: file.drive,
										extension: file.extension,
										email: file.email,
										sharedLink: file.sharedLink,
										name: file.name,
										size: file.size,
										type: file.type,
									}}
									onFileClick={function (): void {
										throw new Error('Function not implemented.');
									}}
								/>
							))
						)}
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
