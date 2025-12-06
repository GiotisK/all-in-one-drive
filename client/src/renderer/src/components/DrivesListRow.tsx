import { DriveEntity, FileType } from '../shared/types/global.types';
import { styled } from 'styled-components';
import { CreateDriveSvg, isVirtualDrive } from '../shared/utils/utils';
import { useAppDispatch } from '../redux/store/store';
import { FileElement } from './FileElement';
import { openModal } from '../redux/slices/modal/modalSlice';
import { ModalKind } from '../redux/slices/modal/types';
import { createSvg, SvgNames } from '../shared/utils/svg-utils';
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-left: 10px;
    padding: 5px 0 5px 10px;
`;

const ColumnBase = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
`;

const FirstColumn = styled(ColumnBase)`
    cursor: pointer;
    flex: 1;
    max-width: 300px;
`;

const SecondColumn = styled(ColumnBase)`
    flex: 0.5;
`;

const ThirdColumn = styled(ColumnBase)`
    flex: 0.5;
`;

const Text = styled.p`
    margin: 0;
    margin-left: 2%;
    width: 90%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 14px;
    margin-right: 5%;
    color: ${({ theme }) => theme.colors.textPrimary};
`;

const TrashcanDiv = styled.div`
    cursor: pointer;
    margin-right: 5%;
    transition: all 0.2s ease;

    &:hover {
        transform: scale(1.3);
        -webkit-transform: scale(1.3);
        -ms-transform: scale(1.3);
    }
`;
export const DrivesListRow = ({ drive }: { drive: DriveEntity }): JSX.Element => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const { type, email, quota } = drive;

    const onDeleteDriveClick = (): void => {
        dispatch(openModal({ kind: ModalKind.Delete, state: { entity: drive } }));
    };

    const navigateToDrive = (): void => {
        navigate(`${drive.id}/root`);
    };

    return (
        <Container>
            <FirstColumn onClick={navigateToDrive}>
                <FileElement type={FileType.Folder} />
                <Text>{email}</Text>
            </FirstColumn>
            <SecondColumn>
                <div style={{ marginRight: 10 }}>{CreateDriveSvg(type, 25)}</div>
            </SecondColumn>
            <ThirdColumn>
                <Text>
                    {quota.used} / {quota.total} GB
                </Text>
                {!isVirtualDrive(type) && (
                    <TrashcanDiv onClick={onDeleteDriveClick}>
                        {createSvg(SvgNames.Trashcan, 25, 'gray')}
                    </TrashcanDiv>
                )}
            </ThirdColumn>
        </Container>
    );
};
