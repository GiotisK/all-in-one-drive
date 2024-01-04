import { styled } from 'styled-components';
import { BaseModal } from './BaseModal';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/types';

const FormatButtonsContainer = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	gap: 30px;
	height: 150px;
	width: 450px;
`;

const FormatButton = styled.button`
	all: unset;
	cursor: pointer;
	border: 1px solid ${({ theme }) => theme.colors.border};
	width: 40px;
	height: 50px;
	text-align: center;
	font-size: 12px;
	border-radius: 5px;
	box-shadow: ${({ theme }) => theme.colors.boxShadow};
	color: ${({ theme }) => theme.colors.textPrimary};
	background-color: ${({ theme }) => theme.colors.backgroundSecondary};
	transition: transform 0.2s ease-in-out;

	&:hover {
		transform: scale(1.1);
	}
`;

export const ExportFormatModal = () => {
	const { visible, exportFormats } = useSelector(
		(state: RootState) => state.modal.exportFormatModal
	);

	return (
		<BaseModal visible={visible} showFooter={false} title='Export as:'>
			<FormatButtonsContainer>
				{exportFormats.map((format, index) => {
					return <FormatButton key={index}> {format} </FormatButton>;
				})}
			</FormatButtonsContainer>
		</BaseModal>
	);
};
