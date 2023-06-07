import { styled } from "styled-components";
import { Input } from "../Input";
import { BaseModal, BaseModalProps } from "./BaseModal";

const Content = styled.div`
	display: flex;
	flex-direction: column;
	height: 100%;
	width: 90%;
`;

const InputContainer = styled.div`
	flex: 2;
	display: flex;
	flex-direction: column;
	justify-content: center;
`;

export const RenameModal = ({
	visible,
	closeModal,
}: BaseModalProps): JSX.Element => {
	return (
		<BaseModal
			visible={visible}
			showFooter={true}
			title="Rename"
			closeModal={closeModal}
			leftButtonText="Cancel"
			rightButtonText="Rename"
		>
			<Content>
				<InputContainer>
					<Input title="Rename file" />
				</InputContainer>
			</Content>
		</BaseModal>
	);
};
