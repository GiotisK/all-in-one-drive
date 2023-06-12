import { styled } from "styled-components";
import { SvgNames, createSvg } from "../Shared/utils/svg-utils";
import { CSSProperties, PropsWithChildren, RefObject } from "react";

const Container = styled.div`
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
	triggerRef?: RefObject<HTMLDivElement>;
	size?: number;
	color?: string;
	style?: CSSProperties;
	onClick?: () => void;
}

export const IconButton = ({
	triggerRef,
	icon,
	size = 16,
	color,
	style = {},
	onClick,
	children,
}: PropsWithChildren<IProps>): JSX.Element => {
	return (
		<Container ref={triggerRef} style={style} onClick={onClick}>
			{createSvg(icon, size, color)}
			{children}
		</Container>
	);
};
