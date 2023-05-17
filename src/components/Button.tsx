import styled, { DefaultTheme, useTheme } from "styled-components";

interface ButtonWrapperProps {
	theme: DefaultTheme;
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
		outline: none;
		box-shadow: 0px 0px 0px 2px #9ad1f3;
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
	styles?: string;
}

export const Button = ({ text, styles = "" }: IProps) => {
	const theme = useTheme();

	return (
		<ButtonWrapper theme={theme} styles={styles}>
			<ButtonText>{text}</ButtonText>
		</ButtonWrapper>
	);
};
