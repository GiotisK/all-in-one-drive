import { styled } from 'styled-components';
import { Input } from '../Input';
import { BaseModal } from './BaseModal';

const Content = styled.div`
	display: flex;
	flex-direction: column;
	height: 100px;
	width: 500px;
`;

export const RenameModal = (): JSX.Element => {
	return (
		<BaseModal
			header={{ title: 'Rename' }}
			footer={{
				leftButton: {
					text: 'Cancel',
				},
				rightButton: {
					text: 'Rename',
				},
			}}
		>
			<Content>
				<Input title='Rename file' />
			</Content>
		</BaseModal>
	);
};
