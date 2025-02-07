import { BaseModal } from './BaseModal';
import { AddDriveButton } from '../AddDriveButton';
import { styled } from 'styled-components';
import { DriveType } from '../../shared/types/global.types';
import { useGetAuthLinkQuery } from '../../redux/rtk/driveApi';
import { useEffect, useState } from 'react';

const ButtonsContainer = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: space-evenly;
	align-items: center;
	height: 200px;
	width: 500px;
`;

export const AddDriveModal = (): JSX.Element => {
	const [drive, setDrive] = useState<DriveType>();
	const { data: authLink = '' } = useGetAuthLinkQuery({ drive }, { skip: !drive });

	useEffect(() => {
		if (authLink) {
			window.location.replace(authLink);
		}
	}, [authLink]);

	const onDriveClick = async (drive: DriveType): Promise<void> => {
		setDrive(drive);
	};

	return (
		<BaseModal headerProps={{ title: 'Add a drive' }}>
			<ButtonsContainer>
				<AddDriveButton
					onClick={() => {
						onDriveClick(DriveType.GoogleDrive);
					}}
					type={DriveType.GoogleDrive}
				/>
				<AddDriveButton
					onClick={() => {
						onDriveClick(DriveType.Dropbox);
					}}
					type={DriveType.Dropbox}
				/>
				<AddDriveButton
					onClick={() => {
						onDriveClick(DriveType.OneDrive);
					}}
					type={DriveType.OneDrive}
				/>
			</ButtonsContainer>
		</BaseModal>
	);
};
