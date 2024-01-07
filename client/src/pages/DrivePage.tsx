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
import { RootState } from '../redux/types';

import { DriveType } from '../shared/types/global.types';
import { useCheckAuthAndRedirect } from '../hooks/useCheckAuth';
import { ModalContainer } from '../components/Modals/ModalContainer';
import { useHandleAuthCodeFromUrl } from '../hooks/useHandleAuthCodeFromUrl';

const RowsScrollview = styled.div`
	flex: 1;
	overflow: auto;
	background-color: ${({ theme }) => theme.colors.background};
`;

export const DrivePage = (): JSX.Element => {
	const [sideMenuVisible, setSideMenuVisible] = useState(false);
	const isUserAuthenticated = useSelector((state: RootState) => state.user.isAuthenticated);

	useCheckAuthAndRedirect();
	useHandleAuthCodeFromUrl();

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
						{[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 16].map(i => (
							<FileRow
								key={i}
								file={{
									id: '1',
									date: '212312',
									drive: DriveType.Dropbox,
									extension: '.jsx',
									fileEmail: 'palaris@moris.com',
									isShared: false,
									name: 'palaris',
									ownerEmail: 'moloris@molia.com',
									permissions: '',
									size: 123,
									type: FileType.File,
								}}
								onFileClick={function (): void {
									throw new Error('Function not implemented.');
								}}
								onCopyShareLinkClick={function (): void {
									throw new Error('Function not implemented.');
								}}
							/>
						))}
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
