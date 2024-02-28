import { styled } from 'styled-components';
import { Input } from '../Input';
import { BaseModal } from './BaseModal';
import { RenameModalState } from '../../redux/slices/modal/types';
import { useAppDispatch, useAppSelector } from '../../redux/store/store';
import { closeModals } from '../../redux/slices/modal/modalSlice';
import { useState, ChangeEvent } from 'react';
import { renameFile } from '../../redux/async-actions/files.async.actions';

const Content = styled.div`
	display: flex;
	flex-direction: column;
	height: 100px;
	width: 500px;
`;

interface IProps {
	state: RenameModalState;
}

export const RenameModal = ({ state }: IProps): JSX.Element => {
	const dispatch = useAppDispatch();
	const renameFileReq = useAppSelector(state => state.files.requests.renameFile);
	const [inputValue, setInputValue] = useState<string>(state.entity?.name ?? '');
	const { entity } = state;

	const onInputChange = (evt: ChangeEvent<HTMLInputElement>) => {
		setInputValue(evt.target.value);
	};

	const sendRenameFileRequest = async () => {
		if (!entity) return;
		const { driveId, id } = entity;
		try {
			await dispatch(renameFile({ driveId, fileId: id, newName: inputValue }));
			dispatch(closeModals());
		} catch {
			//TODO: show toast
		}
	};

	return (
		<BaseModal
			headerProps={{ title: 'Rename' }}
			footerProps={{
				leftButton: {
					text: 'Cancel',
				},
				rightButton: {
					text: 'Rename',
					onClick: sendRenameFileRequest,
				},
				showLoader: renameFileReq.loading,
			}}
		>
			<Content>
				<Input value={inputValue} onChange={onInputChange} title='Name' />
			</Content>
		</BaseModal>
	);
};
