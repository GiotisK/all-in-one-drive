import { styled } from "styled-components";
import { SvgNames, createSvg } from "../Shared/utils/svg-utils";
import { PropsWithChildren } from "react";

const Container = styled.div<{ styles: string }>`
	${({ styles }) => styles};
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 3px;
	border: 1px solid transparent;
	border-radius: 5px;
	cursor: pointer;
	user-select: none;

	&:hover {
		border: 1px solid #f0f0f0;
	}

	&:active {
		border: 1px solid #99c6f3;
	}
`;

interface IProps {
	icon: SvgNames;
	size?: number;
	color?: string;
	styles?: string;
	onClick?: () => void;
}

export const IconButton = ({
	icon,
	size = 16,
	color,
	styles = "",
	onClick,
	children,
}: PropsWithChildren<IProps>): JSX.Element => {
	return (
		<Container styles={styles} onClick={onClick}>
			{createSvg(icon, size, color)}
			{children}
		</Container>
	);
};
