import { styled, useTheme } from 'styled-components';
import { Loader } from './Loader';
import { openModal } from '../redux/slices/modal/modalSlice';
import { ModalKind } from '../redux/slices/modal/types';
import { useAppDispatch } from '../redux/store/store';
import { SvgNames } from '../shared/utils/svg-utils';
import { IconButton } from './IconButton';
import { useGetDrivesQuery } from '../redux/rtk/driveApi';
import { DriveRow } from './DriveRow';
import { useNavigate, useParams } from 'react-router-dom';
import { DriveType } from '../shared/types/global.types';

const Container = styled.div`
    padding: 0% 1% 0% 1%;
    background-color: ${({ theme }) => theme.colors.panelBackground};
    padding: 0% 1% 0% 1%;
    width: 200px;
    display: flex;
    flex-direction: column;
    user-select: none;
`;

const Header = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const HeaderText = styled.div`
    font-size: 16px;
    color: ${({ theme }) => theme.colors.textPrimary};
    cursor: pointer;
    user-select: none;
`;

const NoDrivesText = styled.p`
    text-align: center;
    margin: 0;
    margin-top: 5%;
    color: gray;
    font-size: 16px;
`;

const NoDrivesTextClickable = styled(NoDrivesText)`
    cursor: pointer;
    font-size: 14px;
    text-decoration: underline;
`;

const HeaderAndCheckContainer = styled.div`
    display: flex;
    flex: 1;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
`;

const LoaderContainer = styled.div`
    margin-top: 5%;
`;

export const SideMenu = (): JSX.Element => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const theme = useTheme();
    const { data: drives = [], isLoading: areDrivesLoading } = useGetDrivesQuery();
    const { driveId } = useParams();

    const onAddDriveClick = (): void => {
        dispatch(openModal({ kind: ModalKind.AddDrive }));
    };

    const onDriveClick = (driveId: string) => {
        navigate(`${driveId}/root`);
    };

    return (
        <Container>
            <Header>
                <HeaderAndCheckContainer>
                    <HeaderText>Connected Drives</HeaderText>
                </HeaderAndCheckContainer>
                <IconButton
                    icon={SvgNames.Plus}
                    size={18}
                    color={theme?.colors.panelSvg}
                    onClick={onAddDriveClick}
                />
            </Header>

            {areDrivesLoading ? (
                <LoaderContainer>
                    <Loader size={15} />
                </LoaderContainer>
            ) : !drives.length ? (
                <>
                    <NoDrivesText>There are no connected drives...</NoDrivesText>
                    <NoDrivesTextClickable onClick={onAddDriveClick}>
                        Add a drive
                    </NoDrivesTextClickable>
                </>
            ) : (
                drives.map(drive => {
                    return (
                        <DriveRow
                            onDriveClick={() => {
                                onDriveClick(drive.id);
                            }}
                            active={driveId === drive.id}
                            drive={drive}
                            key={drive.id}
                            styles={
                                drive.type === DriveType.VirtualDrive
                                    ? { borderStyle: 'dashed' }
                                    : {}
                            }
                        />
                    );
                })
            )}
        </Container>
    );
};
