import { PropsWithChildren } from "react";
import { SvgNames, createSvg } from "../../Shared/utils/svg-utils";
import { styled, css } from "styled-components";
import { Keyframes } from "styled-components/dist/types";

const Container = styled.div<{
	$backgroundColor: string;
	$animation?: Keyframes;
}>`
	z-index: 1;
	margin-top: 7px;
	display: flex;
	justify-content: center;
	align-items: center;
	height: 72px;
	width: 72px;
	border-radius: 50%;
	box-shadow: ${({ theme }) => theme.boxShadow};
	cursor: pointer;
	user-select: none;
	box-sizing: border-box;
	background-color: ${({ $backgroundColor }) => $backgroundColor};
	${({ $animation }) =>
		$animation &&
		css`
			animation: ${$animation} 0.3s;
			animation-fill-mode: forwards;
			animation-duration: 0.3s;
		`}
`;

interface IProps {
	color: string;
	icon: SvgNames;
	animation?: Keyframes;
	onClick?: () => void;
}

const FloatingAddButton = ({
	color,
	icon,
	onClick = undefined,
	animation = undefined,
	children,
}: PropsWithChildren<IProps>): JSX.Element => {
	return (
		<Container
			$backgroundColor={color}
			$animation={animation}
			onClick={onClick}
		>
			{children}
			{createSvg(icon, 35, "white")}
		</Container>
	);
};

export default FloatingAddButton;
