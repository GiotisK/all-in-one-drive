import styled from "styled-components";

interface ButtonWrapperProps {
	styles: string;
	$type: ButtonType;
}

const ButtonWrapper = styled.button<ButtonWrapperProps>`
	${({ styles }) => styles};
	width: 80px;
	height: 50px;
	background-color: ${({ $type, theme }) =>
		$type === "primary" ? theme.colors.bluePrimary : "white"};
	border-style: solid;
	border-width: 1px;
	border-radius: 5px;
	border-color: ${({ $type, theme }) =>
		$type === "primary"
			? theme.colors.bluePrimary
			: theme.colors.textSecondary};
	cursor: pointer;
	transform: rotate(0deg);
	transition: transform 0.15s linear;
	color: ${({ $type, theme }) =>
		$type === "primary" ? "white" : theme.colors.textPrimary};

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
`;

interface IProps {
	text: string;
	type?: ButtonType;
	onClick?: () => void;
	styles?: string;
}

type ButtonType = "primary" | "secondary";

export const Button = ({
	text,
	styles = "",
	type = "primary",
	onClick,
}: IProps): JSX.Element => {
	return (
		<ButtonWrapper onClick={onClick} styles={styles} $type={type}>
			<ButtonText>{text}</ButtonText>
		</ButtonWrapper>
	);
};
