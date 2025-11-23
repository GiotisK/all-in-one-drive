import { Loader } from '../components/Loader';
import { styled } from 'styled-components';
import { useGetDrivesQuery } from '../redux/rtk/driveApi';
import { DrivesListRow } from './DrivesListRow';

const LoaderContainer = styled.div`
    height: 100px;
    margin-top: 3%;
`;
const NoFilesText = styled.p`
    text-align: center;
    margin: 0;
    margin-top: 5%;
    color: gray;
    font-size: 16px;
`;

const DrivesContainer = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    paddingtop: 10px;
`;

export const DrivesList = () => {
    const { data: drives = [], isLoading: areDrivesLoading } = useGetDrivesQuery();
    const { isSuccess: drivesSuccess } = useGetDrivesQuery();

    const shouldShowEmptyState = drivesSuccess && drives.length === 0;

    return areDrivesLoading ? (
        <LoaderContainer>
            <Loader size={15} />
        </LoaderContainer>
    ) : shouldShowEmptyState ? (
        <NoFilesText>No connected drives...</NoFilesText>
    ) : (
        <DrivesContainer>
            {drives.map(drive => (
                <DrivesListRow key={drive.id} drive={drive} />
            ))}
        </DrivesContainer>
    );
};
