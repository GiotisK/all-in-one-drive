import { styled } from 'styled-components';
import { Input } from '../Input';
import { BaseModal } from './BaseModal';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/types';

const Content = styled.div`
	display: flex;
	flex-direction: column;
	height: 100px;
	width: 500px;
`;

export const RenameModal = (): JSX.Element => {
	const { visible } = useSelector((state: RootState) => state.modal.renameModal);

	return (
		<BaseModal
			visible={visible}
			showFooter={true}
			title='Rename'
			leftButtonText='Cancel'
			rightButtonText='Rename'
		>
			<Content>
				<Input title='Rename file' />
			</Content>
		</BaseModal>
	);
};
