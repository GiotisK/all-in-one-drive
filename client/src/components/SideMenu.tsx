import { styled } from 'styled-components';
import { Checkbox } from './Checkbox';
import { DriveRow } from './DriveRow';
import { Loader } from './Loader';
import { useDispatch, useSelector } from 'react-redux';
import { openModal } from '../redux/slices/modal/modalSlice';
import { ModalKind } from '../redux/slices/modal/types';
import { RootState } from '../redux/store/types';
import { DriveEntity } from '../shared/types/global.types';

const Container = styled.div`
	padding: 0% 1% 0% 1%;
	width: 300px;
	background-color: ${({ theme }) => theme.colors.panel};
	padding: 0% 1% 0% 1%;
	width: 300px;
	display: flex;
	flex-direction: column;
`;

const Header = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
	align-items: center;
	border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const HeaderText = styled.div`
	font-size: 20px;
	color: ${({ theme }) => theme.colors.textPrimary};
	cursor: pointer;
	user-select: none;
`;

const NoDrivesText = styled.p`
	text-align: center;
	margin: 0;
	margin-top: 5%;
	color: gray;
	font-size: 20px;
`;

const NoDrivesTextClickable = styled(NoDrivesText)`
	cursor: pointer;
	font-size: 17px;
	text-decoration: underline;
`;

export const SideMenu = (): JSX.Element => {
	const dispatch = useDispatch();
	const { drives } = useSelector((state: RootState) => state.drives);

	const drivesLoading = false;

	const onAddDriveClick = (): void => {
		dispatch(openModal({ kind: ModalKind.AddDrive }));
	};

	const onDeleteDriveClick = (drive: DriveEntity): void => {
		dispatch(openModal({ kind: ModalKind.Delete, state: { entity: drive } }));
	};

	return (
		<Container>
			<Header>
				<HeaderText onClick={() => null}>Connected Drives</HeaderText>
				<Checkbox onChange={() => null} checked={true} style={{ marginLeft: '5%' }} />
			</Header>

			{drivesLoading ? (
				<Loader size={25} />
			) : !drives.length ? (
				<>
					<NoDrivesText>There are no connected drives...</NoDrivesText>
					<NoDrivesTextClickable onClick={onAddDriveClick}>
						Add a drive
					</NoDrivesTextClickable>
				</>
			) : (
				drives.map((drive, index) => {
					const { type, email, quota } = drive;

					return (
						<DriveRow
							drive={type}
							email={email}
							enabled
							onClick={() => {
								console.log('cliked');
							}}
							onDeleteDriveClick={() => {
								onDeleteDriveClick(drive);
							}}
							quota={quota}
							key={index}
						/>
					);
				})
			)}
		</Container>
	);
};
