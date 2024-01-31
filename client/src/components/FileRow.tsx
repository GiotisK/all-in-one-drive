import { useRef, useState } from 'react';
import { FileElement } from './FileElement';
import { SvgNames } from '../shared/utils/svg-utils';
import { CreateDriveSvg } from '../shared/utils/utils';
import { IconButton } from './IconButton';
import { styled, useTheme } from 'styled-components';
import { useOutsideClicker } from '../hooks';
import { FileEntity } from '../shared/types/global.types';
import { useDispatch } from 'react-redux';
import { openModal } from '../redux/slices/modal/modalSlice';
import { ModalKind } from '../redux/slices/modal/types';

const Container = styled.div`
	display: flex;
	flex-direction: row;
	margin-left: 10px;
	padding: 10px 0 10px 10px;
	border-bottom: solid 0.5px ${({ theme }) => theme.colors.border};
`;

const ColumnBase = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
	align-items: center;
`;

const FirstColumn = styled(ColumnBase)`
	cursor: pointer;
	width: 40%;
`;

const SecondColumn = styled(ColumnBase)`
	width: 20%;
`;

const ThirdColumn = styled(ColumnBase)`
	width: 10%;
`;

const FourthColumn = styled(ColumnBase)`
	width: 20%;
`;

const Text = styled.p`
	margin: 0;
	margin-left: 2%;
	width: 90%;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	font-size: 16px;
	margin-right: 5%;
	color: ${({ theme }) => theme.colors.textPrimary};
`;

const PopupMenu = styled.div`
	position: absolute;
	z-index: 1;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	width: 100px;
	top: 30px;
	right: 0px;
	border: 1px solid ${({ theme }) => theme.colors.border};
	border-radius: 5px;
	color: ${({ theme }) => theme.colors.textPrimary};
	background-color: ${({ theme }) => theme.colors.background};
	box-shadow: ${({ theme }) => theme.colors.boxShadow}};
`;

const MenuRow = styled.div`
	border-bottom: solid 1px ${({ theme }) => theme.colors.border};
`;

const MenuRowText = styled.p`
	flex-grow: 1;
	margin: 0;
	padding: 3% 3% 3% 5%;
	border-radius: 4px;

	&:hover {
		background-color: ${({ theme }) => theme.colors.blueSecondary};
		cursor: pointer;
	}
`;

interface IProps {
	file: FileEntity;
	onFileClick: () => void;
	onCopyShareLinkClick: () => void;
}

type FileMenuRow = {
	text: string;
	onClick: () => void;
};

export const FileRow = ({ file, onFileClick, onCopyShareLinkClick }: IProps): JSX.Element => {
	const theme = useTheme();
	const dispatch = useDispatch();
	const [menuToggle, setMenuToggle] = useState(false);
	const menuRef = useRef(null);
	const menuTriggerRef = useRef(null);

	useOutsideClicker(menuRef, menuTriggerRef, () => setMenuToggle(false));

	const onDeleteClick = () => {
		dispatch(openModal({ kind: ModalKind.Delete, state: { entity: file } }));
	};

	const onRenameClick = () => {
		dispatch(openModal({ kind: ModalKind.Rename, state: { entity: file } }));
	};

	const fileMenuRows: FileMenuRow[] = [
		{
			text: 'Download',
			onClick: () => {
				console.log('download');
			},
		},
		{
			text: 'Rename',
			onClick: onRenameClick,
		},
		{
			...(file.isShared ? { text: 'Unshare' } : { text: 'Share' }),
			onClick: () => {
				console.log('share');
			},
		},
		{
			text: 'Delete',
			onClick: onDeleteClick,
		},
	];

	const filemenu = (
		<IconButton
			triggerRef={menuTriggerRef}
			icon={SvgNames.Dots}
			size={22}
			color={theme?.colors.textSecondary}
			style={{ position: 'relative' }}
			onClick={() => {
				setMenuToggle(!menuToggle);
			}}
		>
			{menuToggle && (
				<PopupMenu ref={menuRef}>
					{fileMenuRows.map((row, index) => (
						<MenuRow key={index} onClick={row.onClick}>
							<MenuRowText>{row.text}</MenuRowText>
						</MenuRow>
					))}
				</PopupMenu>
			)}
		</IconButton>
	);

	return (
		<Container>
			<FirstColumn onClick={onFileClick}>
				<FileElement type={file.type} extension={file.extension} />
				<Text>{file.name}</Text>
			</FirstColumn>
			<SecondColumn>
				{CreateDriveSvg(file.drive)}
				<Text>{file.email}</Text>
			</SecondColumn>
			<ThirdColumn>
				<Text>{file.size}</Text>
			</ThirdColumn>
			<FourthColumn>
				<Text>{file.date}</Text>
				{filemenu}

				{file.isShared && (
					<IconButton
						icon={SvgNames.Link}
						color={theme?.colors.green}
						size={20}
						onClick={() => {
							console.log('share');
						}}
					/>
				)}
			</FourthColumn>
		</Container>
	);
};
