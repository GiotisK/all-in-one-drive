import { styled, useTheme } from 'styled-components';
import { Checkbox } from './Checkbox';
import { DriveRow } from './DriveRow';
import { Loader } from './Loader';
import { openModal } from '../redux/slices/modal/modalSlice';
import { ModalKind } from '../redux/slices/modal/types';
import { useAppDispatch } from '../redux/store/store';
import { SvgNames } from '../shared/utils/svg-utils';
import { IconButton } from './IconButton';
import { useEffect, useState } from 'react';
import { useGetDrivesQuery } from '../redux/rtk/driveApi';
import { useDriveSelectionContext } from '../hooks/useDriveSelectionContext';

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

const LoaderContainer = styled.div`
	margin-top: 5%;
`;

export const SideMenu = (): JSX.Element => {
	const dispatch = useAppDispatch();
	const { data: drives = [], isLoading: areDrivesLoading } = useGetDrivesQuery();
	const [checked, setChecked] = useState(true);
	const theme = useTheme();
	const { selectedDriveIds, setSelectedDriveIds } = useDriveSelectionContext();

	useEffect(() => {
		setChecked(selectedDriveIds.length === drives.length);
	}, [drives.length, selectedDriveIds.length]);

	const onAddDriveClick = (): void => {
		dispatch(openModal({ kind: ModalKind.AddDrive }));
	};

	const toggleCheckBox = () => {
		checked ? setSelectedDriveIds([]) : setSelectedDriveIds(drives.map(drive => drive.id));
	};

	const onDriveClick = (driveId: string) => {
		if (selectedDriveIds.includes(driveId)) {
			setSelectedDriveIds(prevSelectedDrives =>
				prevSelectedDrives.filter(selectedDriveId => selectedDriveId !== driveId)
			);
		} else {
			setSelectedDriveIds(prevSelectedDrives => [...prevSelectedDrives, driveId]);
		}
	};

	return (
		<Container>
			<Header>
				<HeaderAndCheckContainer>
					<HeaderText onClick={toggleCheckBox}>Connected Drives</HeaderText>
					<Checkbox
						onChange={toggleCheckBox}
						checked={checked}
						style={{ marginLeft: '5%' }}
					/>
				</HeaderAndCheckContainer>
				<IconButton
					icon={SvgNames.Plus}
					size={20}
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
							active={selectedDriveIds.includes(drive.id)}
							drive={drive}
							key={drive.id}
						/>
					);
				})
			)}
		</Container>
	);
};
