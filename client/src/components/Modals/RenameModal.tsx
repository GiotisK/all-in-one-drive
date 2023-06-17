import { styled } from 'styled-components';
import { Input } from '../Input';
import { BaseModal, BaseModalProps } from './BaseModal';

const Content = styled.div`
	display: flex;
	flex-direction: column;
	height: 100px;
	width: 500px;
`;

export const RenameModal = ({ visible, closeModal }: BaseModalProps): JSX.Element => {
	return (
		<BaseModal
			visible={visible}
			showFooter={true}
			title='Rename'
			closeModal={closeModal}
			leftButtonText='Cancel'
			rightButtonText='Rename'
		>
			<Content>
				<Input title='Rename file' />
			</Content>
		</BaseModal>
	);
};
