import { PropsWithChildren } from "react";
import { IconButton } from "../IconButton";
import { SvgNames } from "../../Shared/utils/svg-utils";
import { styled } from "styled-components";
import { Button } from "../Button";

const Container = styled.div`
	position: fixed;
	display: flex;
	justify-content: center;
	align-items: center;
	z-index: 2;
	height: 100%;
	width: 100%;
	background-color: rgb(0, 0, 0);
	background-color: rgba(0, 0, 0, 0.4);
`;

const Backdrop = styled.div`
	position: fixed;
	display: flex;
	justify-content: center;
	align-items: center;
	z-index: 1;
	height: 100%;
	width: 100%;
`;

const ModalContainer = styled.div`
	display: flex;
	z-index: 2;
	position: relative;
	flex-direction: column;
	justify-content: flex-start;
	align-items: center;
	width: 500px;
	height: 250px;
	border-radius: 5px;
	background-color: white;
	box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
`;

const Header = styled.div`
	align-self: flex-start;
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
	align-items: baseline;
	width: 92%;
	margin: 3% 0% 1% 5%;
	border-bottom: 1px solid lightgray;
`;

const HeaderText = styled.p`
	margin: 0;
	margin-bottom: 3px;
	font-size: 25px;
	color: #363636;
`;

const Footer = styled.div`
	display: flex;
	width: 90%;
	justify-content: flex-end;
	border-top: 1px solid lightgray;
`;

export interface BaseModalProps {
	visible: boolean;
	closeModal: () => void;
}

interface IProps extends BaseModalProps {
	title?: string;
	showFooter?: boolean;
	leftButtonText?: string;
	rightButtonText?: string;
}

export const BaseModal = ({
	visible,
	title = "",
	showFooter = false,
	leftButtonText = "",
	rightButtonText = "",
	closeModal,
	children,
}: PropsWithChildren<IProps>): JSX.Element => {
	return (
		<>
			{visible && (
				<Container>
					<Backdrop onClick={closeModal} />

					<ModalContainer>
						<Header>
							<HeaderText>{title}</HeaderText>
							<IconButton
								styles="margin-left: auto"
								icon={SvgNames.Close}
								onClick={closeModal}
							/>
						</Header>
						{children}
						{showFooter && (
							<Footer>
								<Button
									text={leftButtonText}
									styles="margin: 3%"
									onClick={closeModal}
								/>
								<Button
									text={rightButtonText}
									styles="margin-top: 3%"
								/>
							</Footer>
						)}
					</ModalContainer>
				</Container>
			)}
		</>
	);
};
