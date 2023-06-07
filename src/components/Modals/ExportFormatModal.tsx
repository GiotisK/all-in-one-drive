import { styled } from "styled-components";
import { BaseModal, BaseModalProps } from "./BaseModal";

interface IProps extends BaseModalProps {
	exportFormats: string[];
}

const FormatButtonsContainer = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	gap: 30px;
	height: 70%;
	width: 90%;
`;

const FormatButton = styled.button`
	all: unset;
	cursor: pointer;
	border: 1px solid lightgray;
	width: 40px;
	height: 50px;
	text-align: center;
	font-size: 12px;
	border-radius: 5px;
	box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);

	&:hover {
		transform: scale(1.1);
	}
`;

export const ExportFormatModal = ({
	visible,
	closeModal,
	exportFormats,
}: IProps) => {
	return (
		<BaseModal
			visible={visible}
			showFooter={false}
			title="Export as:"
			closeModal={closeModal}
		>
			<FormatButtonsContainer>
				{exportFormats.map((format, index) => {
					return <FormatButton key={index}> {format} </FormatButton>;
				})}
			</FormatButtonsContainer>
		</BaseModal>
	);
};
