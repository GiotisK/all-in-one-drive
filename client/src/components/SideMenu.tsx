import { styled, useTheme } from 'styled-components';
import { Checkbox } from './Checkbox';
import { DriveRow } from './DriveRow';
import { Loader } from './Loader';
import { openModal } from '../redux/slices/modal/modalSlice';
import { ModalKind } from '../redux/slices/modal/types';
import { DriveEntity } from '../shared/types/global.types';
import { useAppDispatch, useAppSelector } from '../redux/store/store';
import { SvgNames } from '../shared/utils/svg-utils';
import { IconButton } from './IconButton';

const Container = styled.div`
	padding: 0% 1% 0% 1%;
	width: 300px;
	background-color: ${({ theme }) => theme.colors.panelBackground};
	padding: 0% 1% 0% 1%;
	width: 300px;
	display: flex;
	flex-direction: column;
`;

const Header = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: space-between;
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

const HeaderAndCheckContainer = styled.div`
	display: flex;
	flex: 1;
	flex-direction: row;
	justify-content: flex-start;
	align-items: center;
`;
export const SideMenu = (): JSX.Element => {
	const dispatch = useAppDispatch();
	const theme = useTheme();
	const drives = useAppSelector(state => state.drives.drives);
	const drivesLoading = useAppSelector(state => state.drives.requests.getDrives.loading);

	const onAddDriveClick = (): void => {
		dispatch(openModal({ kind: ModalKind.AddDrive }));
	};

	const onDeleteDriveClick = (drive: DriveEntity): void => {
		dispatch(openModal({ kind: ModalKind.Delete, state: { entity: drive } }));
	};

	return (
		<Container>
			<Header>
				<HeaderAndCheckContainer>
					<HeaderText onClick={() => null}>Connected Drives</HeaderText>
					<Checkbox onChange={() => null} checked={true} style={{ marginLeft: '5%' }} />
				</HeaderAndCheckContainer>
				<IconButton
					icon={SvgNames.Plus}
					size={20}
					color={theme?.colors.panelSvg}
					onClick={onAddDriveClick}
				/>
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
				drives.map(drive => {
					const { type, email, quota, id } = drive;

					return (
						<DriveRow
							drive={type}
							email={email}
							enabled
							onDeleteDriveClick={() => {
								onDeleteDriveClick(drive);
							}}
							quota={quota}
							key={id}
						/>
					);
				})
			)}
		</Container>
	);
};
