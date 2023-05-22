import { InputHTMLAttributes } from "react";
import styled from "styled-components";

const InputFieldDiv = styled.div`
	display: flex;
	flex-direction: column;
	margin-top: 2%;
	margin-left: 5%;
	margin-right: 5%;
`;

const InputFieldContainer = styled.input`
	border: 1px solid #ccc;
	padding-left: 2%;
	height: 40px;
	font-size: 15px;
	border-radius: 8px;
	outline: none;

	&:focus {
		outline: 1px solid ${({ theme }) => theme.colors.blueSecondary};
	}
`;

const InputLabel = styled.label`
	font-size: 18px;
	color: ${({ theme }) => theme.colors.textPrimary};
`;

interface IProps extends InputHTMLAttributes<HTMLInputElement> {
	title: string;
}

export const Input = (props: IProps): JSX.Element => {
	return (
		<InputFieldDiv>
			<InputLabel>{props.title}</InputLabel>
			<InputFieldContainer
				name={props.name}
				value={props.value}
				onChange={props.onChange}
				type={props.type}
			/>
		</InputFieldDiv>
	);
};
