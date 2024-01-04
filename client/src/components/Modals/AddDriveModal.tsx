import { BaseModal } from './BaseModal';
import { AddDriveButton } from '../AddDriveButton';
import { styled } from 'styled-components';
import { DriveType } from '../../shared/types/global.types';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/types';

const ButtonsContainer = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: space-evenly;
	align-items: center;
	height: 200px;
	width: 500px;
`;

export const AddDriveModal = (): JSX.Element => {
	const { visible } = useSelector((state: RootState) => state.modal.addDriveModal);

	return (
		<BaseModal title='Add a drive' visible={visible} showFooter={false}>
			<ButtonsContainer>
				<AddDriveButton type={DriveType.GoogleDrive} />
				<AddDriveButton type={DriveType.Dropbox} />
				<AddDriveButton type={DriveType.OneDrive} />
			</ButtonsContainer>
		</BaseModal>
	);
};
