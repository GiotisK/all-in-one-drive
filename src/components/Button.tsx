import styled from "styled-components";

interface ButtonWrapperProps {
	styles: string;
}

const ButtonWrapper = styled.button<ButtonWrapperProps>`
	${({ styles }) => styles};
	width: 80px;
	height: 50px;
	background-color: ${({ theme }) => theme.colors.bluePrimary};
	border-width: 0px;
	border-radius: 5px;
	cursor: pointer;
	transform: rotate(0deg);
	transition: transform 0.15s linear;

	&:hover {
		opacity: 95%;
	}

	&:active {
		transform: rotate(4deg);
		transition: transform 0.15s linear;
	}

	&:focus {
		outline: 2px solid ${({ theme }) => theme.colors.blueSecondary};
	}
`;

const ButtonText = styled.p`
	margin: 0;
	padding-top: 20%;
	padding-bottom: 20%;
	font-size: 15px;
	color: white;
`;

interface IProps {
	text: string;
	onClick?: () => void;
	styles?: string;
}

export const Button = ({ text, styles = "", onClick }: IProps): JSX.Element => {
	return (
		<ButtonWrapper onClick={onClick} styles={styles}>
			<ButtonText>{text}</ButtonText>
		</ButtonWrapper>
	);
};
