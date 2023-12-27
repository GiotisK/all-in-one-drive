import { useEffect, useState } from 'react';
import { AddDriveModal } from '../components/Modals/AddDriveModal';
import { DeleteModal } from '../components/Modals/DeleteModal';
import { DriveType, FileType } from '../shared/types/types';
import { RenameModal } from '../components/Modals/RenameModal';
import { ExportFormatModal } from '../components/Modals/ExportFormatModal';
import { MenuBanner } from '../components/MenuBanner';
import { DropZone } from '../components/DropZone';
import { FileRow } from '../components/FileRow';
import { SideMenu } from '../components/SideMenu';
import { TitleBanner } from '../components/TitleBanner';
import { UploadModal } from '../components/Modals/UploadModal';
import { MultimediaModal } from '../components/Modals/MultimediaModal';
import { FloatingButtonsContainer } from '../components/FloatingButtons/FloatingButtonsContainer';
import { Loader } from '../components/Loader';
import { LoadingBar } from '../components/LoadingBar';
import { styled } from 'styled-components';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/types';
import { Navigate } from 'react-router-dom';
import { routes } from '../shared/constants/routes';

const RowsScrollview = styled.div`
	flex: 1;
	overflow: auto;
	background-color: ${({ theme }) => theme.colors.background};
`;

export const DrivePage = (): JSX.Element => {
	const [deleteModalVisible, setDeleteModalVisible] = useState(false);
	const [addDriveModalVisible, setAddDriveModalVisible] = useState(false);
	const [renameModalVisible, setRenameModalVisible] = useState(false);
	const [exportFormatModalVisible, setExportFormatModalVisible] = useState(false);

	const [uploadModalVisible, setUploadModalVisible] = useState(false);
	const [sideMenuVisible, setSideMenuVisible] = useState(false);
	const isUserAuthenticated = useSelector((state: RootState) => state.user.isAuthenticated);

	useEffect(() => {
		console.log('location search', location.search);
	}, []);

	return (
		/* isUserAuthenticated ? */ <div
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
				{sideMenuVisible && (
					<SideMenu
						checkboxChecked={true}
						onCheckboxClick={() => {
							console.log('checkbox clicked');
						}}
						onCloseSideMenuClick={() => {
							setSideMenuVisible(false);
						}}
					/>
				)}
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
			<RenameModal
				closeModal={() => {
					console.log('close modal');
				}}
				visible={false}
			/>
		</div>
	); /*: (
		<Navigate replace to={routes.home} />
	); */
};
