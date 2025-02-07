import styled, { useTheme } from 'styled-components';
import { SvgNames, createSvg } from '../shared/utils/svg-utils';
import { CreateDriveSvg } from '../shared/utils/utils';
import { DriveEntity, DriveQuota } from '../shared/types/global.types';
import { ModalKind } from '../redux/slices/modal/types';
import { openModal } from '../redux/slices/modal/modalSlice';
import { useAppDispatch } from '../redux/store/store';

const DriveElementContainer = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
	height: 73px;
	background-color: ${({ theme }) => theme.colors.background};
	margin: 2% 0% 0% 0%;
	border: solid 1px ${({ theme }) => theme.colors.border};
	border-radius: 5px;
	width: 300px;
	cursor: pointer;
	user-select: none;
	position: relative;
	color: ${({ theme }) => theme.colors.textPrimary};
`;

const DriveElementEmail = styled.div`
	margin: 0;
	font-size: 14px;
	overflow-wrap: break-word;
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
	overflow: hidden;
	text-overflow: ellipsis;
`;

const DriveElementQuota = styled.p`
	align-self: flex-start;
	margin: 0;
	margin-top: 1%;
	font-size: 13px;
`;

const EmailQuotaContainer = styled.div`
	display: flex;
	width: 100%;
	flex-direction: column;
	overflow: hidden;
`;

const TrashcanDiv = styled.div`
	align-self: flex-end;
	margin-bottom: 10px;
	margin-right: 9px;
	transition: all 0.2s ease;

	&:hover {
		transform: scale(1.3);
		-webkit-transform: scale(1.3);
		-ms-transform: scale(1.3);
	}
`;

const TrashCanAndIndicatorContainer = styled.div`
	display: flex;
	height: 73px;
	flex-direction: row;
	justify-content: flex-end;
`;

const ActiveIndicator = styled.div`
	height: 73px;
	width: 5px;
	border-top-right-radius: 5px;
	border-bottom-right-radius: 5px;
	position: absolute;
`;

const DriveSvgContainer = styled.div`
	margin: 3% 2% 2% 2%;
	height: min-content;
	width: min-content;
`;

interface IProps {
	drive: DriveEntity;
	active: boolean;
	onDriveClick: () => void;
}

export const DriveRow = ({ drive, active, onDriveClick }: IProps): JSX.Element => {
	const dispatch = useAppDispatch();
	const theme = useTheme();

	const formatQuota = (quota: DriveQuota) => {
		return quota.used + ' / ' + quota.total + 'GB';
	};

	const onDeleteDriveClick = (e: React.MouseEvent): void => {
		e.stopPropagation();
		dispatch(openModal({ kind: ModalKind.Delete, state: { entity: drive } }));
	};

	return (
		<DriveElementContainer onClick={onDriveClick} style={{ opacity: active ? 1 : 0.5 }}>
			<DriveSvgContainer>{CreateDriveSvg(drive.type)}</DriveSvgContainer>

			<EmailQuotaContainer>
				<DriveElementEmail>{drive.email}</DriveElementEmail>
				<DriveElementQuota>{formatQuota(drive.quota)}</DriveElementQuota>
			</EmailQuotaContainer>

			<TrashCanAndIndicatorContainer>
				<TrashcanDiv onClick={onDeleteDriveClick}>
					{createSvg(SvgNames.Trashcan, 25, 'gray')}
				</TrashcanDiv>
				<ActiveIndicator
					style={{
						backgroundColor: active ? theme?.colors.green : theme?.colors.border,
					}}
				/>
			</TrashCanAndIndicatorContainer>
		</DriveElementContainer>
	);
};
