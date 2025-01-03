import { styled } from 'styled-components';
import { Input } from '../Input';
import { BaseModal } from './BaseModal';
import { RenameModalState } from '../../redux/slices/modal/types';
import { useAppDispatch, useAppSelector } from '../../redux/store/store';
import { closeModals } from '../../redux/slices/modal/modalSlice';
import { useState, ChangeEvent } from 'react';
import { renameFile } from '../../redux/async-actions/files.async.actions';
import { toast } from 'react-toastify';

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
		//todo: fix, catch will never get triggered
		try {
			await dispatch(renameFile({ driveId, fileId: id + '1234', newName: inputValue }));
			toast.success('File renamed successfully');
			dispatch(closeModals());
		} catch {
			toast.error('Rename failed');
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
