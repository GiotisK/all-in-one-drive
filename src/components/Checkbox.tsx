import { CSSProperties } from "react";
import styled from "styled-components";

const CheckboxContainer = styled.p`
	position: relative;

	label:hover:before {
		border: 2px solid #99c6f3 !important;
	}
`;

const Label = styled.label``;

const CheckboxInput = styled.input`
	display: none;

	&:not(:checked) + label,
	&:checked + label {
		cursor: pointer;
	}

	/* the box element */
	&:not(:checked) + ${Label}:before, &:checked + ${Label}:before {
		content: "";
		position: relative;
		display: block;
		width: 1em;
		height: 1em;
		border: 2px solid #ccc;
		background: #fff;
		border-radius: 4px;
		box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
	}

	/* the tick element */
	&:not(:checked) + ${Label}:after, &:checked + ${Label}:after {
		content: "\\2713\\0020";
		top: 0.3em;
		left: 0.2em;
		position: absolute;
		font-size: 1.1em;
		line-height: 0.8;
		color: #09ad7e;
		transition: all 0.2s;
		font-family: "Lucida Sans Unicode", "Arial Unicode MS", Arial;
	}

	/* the tick element not-checked */
	&:not(:checked) + ${Label}:after {
		opacity: 0;
		transform: scale(0);
	}

	/* the tick element checked */
	&:checked + ${Label}:after {
		opacity: 1;
		transform: scale(1);
	}
`;

interface IProps {
	checked: boolean;
	style?: CSSProperties;
	onChange: () => void;
}

export const Checkbox = ({
	checked,
	style = {},
	onChange,
}: IProps): JSX.Element => {
	return (
		<CheckboxContainer style={style}>
			<CheckboxInput
				type="checkbox"
				id="checkbox-input"
				checked={checked}
				onChange={onChange}
			/>
			<Label htmlFor="checkbox-input" />
		</CheckboxContainer>
	);
};
