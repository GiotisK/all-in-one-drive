import { styled } from 'styled-components';
import { Input } from '../Input';
import { BaseModal } from './BaseModal';
import { RenameModalState } from '../../redux/slices/modal/types';
import { useAppDispatch } from '../../redux/store/store';
import { closeModals } from '../../redux/slices/modal/modalSlice';
import { useState, ChangeEvent, useEffect } from 'react';
import { useRenameDriveFileMutation } from '../../redux/rtk/driveApi';

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
    const [renameFile, { isLoading: renameLoading, isSuccess: renameSuccess }] =
        useRenameDriveFileMutation();
    const [inputValue, setInputValue] = useState<string>(state.entity?.name ?? '');
    const { entity } = state;

    useEffect(() => {
        if (renameSuccess) {
            dispatch(closeModals());
        }
    }, [dispatch, renameSuccess]);

    const onInputChange = (evt: ChangeEvent<HTMLInputElement>) => {
        setInputValue(evt.target.value);
    };

    const sendRenameFileRequest = async () => {
        if (!entity) return;
        const { driveId, id } = entity;

        renameFile({ driveId, fileId: id, name: inputValue });
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
                showLoader: renameLoading,
            }}
        >
            <Content>
                <Input value={inputValue} onChange={onInputChange} title='Name' />
            </Content>
        </BaseModal>
    );
};
