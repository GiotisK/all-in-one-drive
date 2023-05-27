import { PropsWithChildren } from "react";
import "./FloatingAddButton.css";
import { SvgNames, createSvg } from "../../Shared/utils/svg-utils";

interface IProps {
	color: string;
	icon: SvgNames;
	classes?: string;
	onClick?: () => void;
}

const FloatingAddButton = ({
	color,
	icon,
	classes = "",
	onClick = undefined,
	children,
}: PropsWithChildren<IProps>): JSX.Element => {
	return (
		<div
			className={"floating-button " + classes}
			style={{ backgroundColor: color }}
			onClick={onClick}
		>
			{children}
			{createSvg(icon, 35)}
		</div>
	);
};

export default FloatingAddButton;
