import { useState } from 'react';
import { FileType } from '../shared/types/types';
import { MenuBanner } from '../components/MenuBanner';
import { DropZone } from '../components/DropZone';
import { FileRow } from '../components/FileRow';
import { SideMenu } from '../components/SideMenu';
import { TitleBanner } from '../components/TitleBanner';
import { FloatingButtonsContainer } from '../components/FloatingButtons/FloatingButtonsContainer';
import { LoadingBar } from '../components/LoadingBar';
import { styled } from 'styled-components';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store/types';

import { DriveType } from '../shared/types/global.types';
import { ModalContainer } from '../components/Modals/ModalContainer';
import { useCheckAuthAndRedirect, useFetchDrives, useHandleAuthCodeFromUrl } from '../hooks';
import { useFetchFiles } from '../hooks/useFetchFiles';
import { Loader } from '../components/Loader';

const RowsScrollview = styled.div`
	flex: 1;
	overflow: auto;
	background-color: ${({ theme }) => theme.colors.background};
`;

const LoaderContainer = styled.div`
	margin-top: 3%;
`;

export const DrivePage = (): JSX.Element => {
	const [sideMenuVisible, setSideMenuVisible] = useState(false);
	const isUserAuthenticated = useSelector((state: RootState) => state.user.isAuthenticated);
	const files = useSelector((state: RootState) => state.files.files);

	useCheckAuthAndRedirect();
	useHandleAuthCodeFromUrl();
	useFetchDrives();
	const { loading: filesLoading } = useFetchFiles();

	return isUserAuthenticated ? (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				height: '100%',
			}}
		>
			<TitleBanner
				onBurgerMenuClick={() => {
					setSideMenuVisible(prevVisible => !prevVisible);
				}}
			/>
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
										isShared: false,
										name: file.name,
										ownerEmail: file.email,
										permissions: '',
										size: file.size,
										type: file.type,
									}}
									onFileClick={function (): void {
										throw new Error('Function not implemented.');
									}}
									onCopyShareLinkClick={function (): void {
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
		<></>
	);
};
